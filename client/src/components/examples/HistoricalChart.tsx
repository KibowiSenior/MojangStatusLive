import HistoricalChart from "../HistoricalChart";

export default function HistoricalChartExample() {
  const mockData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    minecraft: 95 + Math.random() * 5,
    session: 96 + Math.random() * 4,
    account: 94 + Math.random() * 6,
    sessionserver: 97 + Math.random() * 3,
    api: 98 + Math.random() * 2,
    textures: 99 + Math.random() * 1,
  }));

  const services = [
    { name: "minecraft.net", key: "minecraft", color: "#22c55e" },
    { name: "session.minecraft.net", key: "session", color: "#3b82f6" },
    { name: "account.mojang.com", key: "account", color: "#a855f7" },
    { name: "sessionserver.mojang.com", key: "sessionserver", color: "#f59e0b" },
    { name: "api.mojang.com", key: "api", color: "#ec4899" },
    { name: "textures.minecraft.net", key: "textures", color: "#14b8a6" },
  ];

  return <HistoricalChart data={mockData} services={services} />;
}
