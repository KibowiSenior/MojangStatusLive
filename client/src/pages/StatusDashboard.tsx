import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import ServiceCard from "@/components/ServiceCard";
import HistoricalChart from "@/components/HistoricalChart";
import { type ServiceStatus } from "@/components/StatusBadge";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/queryClient";

interface ServiceData {
  name: string;
  url: string;
  description: string;
  status: ServiceStatus;
  uptime: number;
  responseTime: number;
  lastChecked?: string;
}

interface SparklineData {
  [key: string]: number[];
}

export default function StatusDashboard() {
  const [nextCheckIn, setNextCheckIn] = useState(30);

  // Fetch current service statuses
  const { data: services = [], isLoading } = useQuery<ServiceData[]>({
    queryKey: ["/api/status"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch sparkline data
  const { data: sparklineData = {} } = useQuery<SparklineData>({
    queryKey: ["/api/sparklines"],
    refetchInterval: 30000,
  });

  // Fetch historical chart data
  const { data: chartData = [] } = useQuery<any[]>({
    queryKey: ["/api/history"],
    refetchInterval: 60000, // Refetch every minute
  });

  const chartServices = [
    { name: "minecraft.net", key: "minecraft_net", color: "#22c55e" },
    { name: "session.minecraft.net", key: "session_minecraft_net", color: "#3b82f6" },
    { name: "account.mojang.com", key: "account_mojang_com", color: "#a855f7" },
    { name: "sessionserver.mojang.com", key: "sessionserver_mojang_com", color: "#f59e0b" },
    { name: "api.mojang.com", key: "api_mojang_com", color: "#ec4899" },
    { name: "textures.minecraft.net", key: "textures_minecraft_net", color: "#14b8a6" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setNextCheckIn((prev) => {
        if (prev <= 1) {
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    console.log("Manual refresh triggered");
    await queryClient.invalidateQueries({ queryKey: ["/api/status"] });
    await queryClient.invalidateQueries({ queryKey: ["/api/sparklines"] });
    await queryClient.invalidateQueries({ queryKey: ["/api/history"] });
    setNextCheckIn(30);
  };

  const lastUpdated = services.length > 0 && services[0].lastChecked
    ? new Date(services[0].lastChecked)
    : new Date();

  return (
    <div 
      className="min-h-screen bg-background relative"
      style={{
        backgroundImage: 'url(/attached_assets/cozy-forest_1761886678402.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
      <div className="relative z-10">
        <a 
          href="https://cloudnord.net/minecraft-server-hosting" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block bg-gradient-to-r from-green-600 to-emerald-500 border-b-2 border-green-400 hover:from-green-500 hover:to-emerald-400 transition-all"
          data-testid="link-ad-banner"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div className="text-center">
              <p className="text-white font-bold text-lg mb-1" data-testid="text-ad-title">
                ⚡ Host your Minecraft Server at Cloudnord
              </p>
              <p className="text-white/90 text-sm" data-testid="text-ad-subtitle">
                Starting at 4 GB RAM for only €4.50/month - Fast, Reliable, 24/7 Support
              </p>
            </div>
          </div>
        </a>
        <Header nextCheckIn={nextCheckIn} lastUpdated={lastUpdated} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-white">Service Status</h2>
            <p className="text-white/70">
              Real-time monitoring of all Mojang services
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            data-testid="button-refresh"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Now
          </Button>
        </div>

        {isLoading && services.length === 0 ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-white/60" />
            <p className="text-white/70">Loading service status...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service.url}
                  name={service.name}
                  url={service.url}
                  description={service.description}
                  status={service.status}
                  uptime={service.uptime}
                  responseTime={service.responseTime}
                  historicalData={sparklineData[service.url] || [100]}
                />
              ))}
            </div>

            {chartData.length > 0 && (
              <HistoricalChart data={chartData} services={chartServices} />
            )}
          </>
        )}

        <footer className="text-center py-6 text-sm text-white/60 border-t border-white/10">
          <p>Data refreshes every 30 seconds</p>
          <p className="mt-2">
            For official updates, visit{" "}
            <a
              href="https://www.minecraft.net/en-us/status"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:underline"
            >
              Mojang Status Page
            </a>
          </p>
        </footer>
      </main>
      </div>
    </div>
  );
}
