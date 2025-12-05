interface LiveIndicatorProps {
  nextCheckIn?: number;
}

export default function LiveIndicator({ nextCheckIn }: LiveIndicatorProps) {
  return (
    <div className="flex items-center gap-2" data-testid="indicator-live">
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-green-500">LIVE</span>
        {nextCheckIn !== undefined && (
          <span className="text-xs text-muted-foreground">
            Next check in {nextCheckIn}s
          </span>
        )}
      </div>
    </div>
  );
}
