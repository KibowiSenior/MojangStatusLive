import { storage } from "./storage";
import type { InsertServiceStatus } from "@shared/schema";

interface MojangService {
  name: string;
  url: string;
  description: string;
  endpoint: string;
}

const MOJANG_SERVICES: MojangService[] = [
  {
    name: "minecraft.net",
    url: "minecraft.net",
    description: "Main Minecraft website",
    endpoint: "https://minecraft.net",
  },
  {
    name: "session.minecraft.net",
    url: "session.minecraft.net",
    description: "Session authentication for multiplayer",
    endpoint: "https://session.minecraft.net",
  },
  {
    name: "account.mojang.com",
    url: "account.mojang.com",
    description: "Mojang account management",
    endpoint: "https://account.mojang.com",
  },
  {
    name: "sessionserver.mojang.com",
    url: "sessionserver.mojang.com",
    description: "Session server for login/auth",
    endpoint: "https://sessionserver.mojang.com",
  },
  {
    name: "api.mojang.com",
    url: "api.mojang.com",
    description: "API for Minecraft services",
    endpoint: "https://api.mojang.com",
  },
  {
    name: "textures.minecraft.net",
    url: "textures.minecraft.net",
    description: "Minecraft skins and textures",
    endpoint: "https://textures.minecraft.net",
  },
];

async function checkServiceHealth(service: MojangService): Promise<InsertServiceStatus> {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    // Try GET request first, fallback to HEAD if needed
    const response = await fetch(service.endpoint, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; StatusChecker/1.0)",
      },
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    // Determine status based on response
    let status: "online" | "down" | "degraded";
    if (response.ok || response.status === 403 || response.status === 301 || response.status === 302) {
      // 403/301/302 means the server is up, just blocking/redirecting us
      status = responseTime > 2000 ? "degraded" : "online";
    } else if (response.status >= 500) {
      status = "down";
    } else if (response.status === 404) {
      // 404 means server is responding, just no content at root
      status = "online";
    } else {
      status = "degraded";
    }
    
    return {
      serviceName: service.name,
      serviceUrl: service.url,
      status,
      responseTime,
      uptime: null, // Uptime will be calculated from historical data
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`Error checking ${service.name}:`, error);
    
    return {
      serviceName: service.name,
      serviceUrl: service.url,
      status: "down",
      responseTime,
      uptime: null, // Uptime will be calculated from historical data
    };
  }
}

export async function checkAllServices(): Promise<void> {
  console.log("Checking all Mojang services...");
  
  const checks = MOJANG_SERVICES.map((service) => checkServiceHealth(service));
  const results = await Promise.all(checks);
  
  // Store all results
  await Promise.all(results.map((result) => storage.createServiceStatus(result)));
  
  console.log(`✓ Checked ${results.length} services`);
}

let monitoringInterval: NodeJS.Timeout | null = null;

export function startMonitoring(intervalSeconds: number = 30): void {
  if (monitoringInterval) {
    console.log("Monitoring already running");
    return;
  }
  
  console.log(`Starting monitoring (every ${intervalSeconds}s)...`);
  
  // Check immediately on start
  checkAllServices();
  
  // Then check on interval
  monitoringInterval = setInterval(() => {
    checkAllServices();
  }, intervalSeconds * 1000);
}

export function stopMonitoring(): void {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
    console.log("Monitoring stopped");
  }
}

export { MOJANG_SERVICES };
