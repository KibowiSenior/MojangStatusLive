import MiniSparkline from "../MiniSparkline";

export default function MiniSparklineExample() {
  const mockData = [95, 97, 99, 98, 100, 99, 98, 97, 99, 100];

  return (
    <div className="w-full max-w-md">
      <MiniSparkline data={mockData} status="online" />
    </div>
  );
}
