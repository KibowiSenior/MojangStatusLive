import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { startMonitoring, MOJANG_SERVICES } from "./health-checker";

export async function registerRoutes(app: Express): Promise<Server> {
  // Start the monitoring service
  startMonitoring(30); // Check every 30 seconds
  
  // Get current status of all services
  app.get("/api/status", async (req, res) => {
    try {
      const latestStatuses = await storage.getLatestServiceStatuses();
      
      // Calculate uptime from historical data for each service
      const statusWithDetails = await Promise.all(
        MOJANG_SERVICES.map(async (service) => {
          const status = latestStatuses.find((s) => s.serviceUrl === service.url);
          const uptime = await storage.calculateServiceUptime(service.url, 24);
          
          return {
            name: service.name,
            url: service.url,
            description: service.description,
            status: status?.status || "unknown",
            responseTime: status?.responseTime || 0,
            uptime: uptime,
            lastChecked: status?.checkedAt,
          };
        })
      );
      
      res.json(statusWithDetails);
    } catch (error) {
      console.error("Error fetching status:", error);
      res.status(500).json({ error: "Failed to fetch service status" });
    }
  });
  
  // Get historical data for all services (aggregated by hour)
  app.get("/api/history", async (req, res) => {
    try {
      const hours = parseInt(req.query.hours as string) || 24;
      const history = await storage.getAllServicesHistory(hours);
      
      // Group by actual hour timestamp (truncate to the hour)
      const hourlyData = new Map<number, Map<string, { online: number; total: number }>>();
      
      history.forEach((record) => {
        const recordDate = new Date(record.checkedAt);
        // Truncate to hour by setting minutes, seconds, and milliseconds to 0
        const hourTimestamp = new Date(
          recordDate.getFullYear(),
          recordDate.getMonth(),
          recordDate.getDate(),
          recordDate.getHours(),
          0,
          0,
          0
        ).getTime();
        
        if (!hourlyData.has(hourTimestamp)) {
          hourlyData.set(hourTimestamp, new Map());
        }
        
        const hourData = hourlyData.get(hourTimestamp)!;
        if (!hourData.has(record.serviceUrl)) {
          hourData.set(record.serviceUrl, { online: 0, total: 0 });
        }
        
        const serviceData = hourData.get(record.serviceUrl)!;
        serviceData.total += 1;
        if (record.status === "online") {
          serviceData.online += 1;
        }
      });
      
      // Convert to array format for charts, sorted chronologically
      const chartData = Array.from(hourlyData.entries())
        .sort((a, b) => a[0] - b[0]) // Sort by actual timestamp
        .map(([timestamp, services]) => {
          const date = new Date(timestamp);
          const timeStr = `${date.getHours()}:00`;
          const dataPoint: any = { time: timeStr };
          
          services.forEach((data, serviceUrl) => {
            const serviceKey = serviceUrl.replace(/\./g, "_");
            dataPoint[serviceKey] = (data.online / data.total) * 100;
          });
          
          return dataPoint;
        });
      
      res.json(chartData);
    } catch (error) {
      console.error("Error fetching history:", error);
      res.status(500).json({ error: "Failed to fetch service history" });
    }
  });
  
  // Get 24-hour sparkline data for all services
  app.get("/api/sparklines", async (req, res) => {
    try {
      const history = await storage.getAllServicesHistory(24);
      
      // Group by service and resample to ~20 data points for sparklines
      const serviceData = new Map<string, number[]>();
      
      MOJANG_SERVICES.forEach((service) => {
        const serviceHistory = history.filter((h) => h.serviceUrl === service.url);
        
        if (serviceHistory.length === 0) {
          serviceData.set(service.url, [100]);
          return;
        }
        
        // Resample to approximately 20 points across 24 hours
        const targetPoints = 20;
        const pointsPerBucket = Math.max(1, Math.floor(serviceHistory.length / targetPoints));
        const sparklineData: number[] = [];
        
        for (let i = 0; i < serviceHistory.length; i += pointsPerBucket) {
          const bucket = serviceHistory.slice(i, i + pointsPerBucket);
          const onlineCount = bucket.filter(s => s.status === "online").length;
          const uptimePercent = (onlineCount / bucket.length) * 100;
          sparklineData.push(uptimePercent);
        }
        
        serviceData.set(service.url, sparklineData.slice(0, targetPoints));
      });
      
      res.json(Object.fromEntries(serviceData));
    } catch (error) {
      console.error("Error fetching sparklines:", error);
      res.status(500).json({ error: "Failed to fetch sparkline data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
