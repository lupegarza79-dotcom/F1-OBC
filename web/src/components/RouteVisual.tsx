import { cn } from "@/lib/utils";
import { Plane } from "lucide-react";

export function RouteVisual({
  from,
  to,
  fromLabel,
  toLabel,
  flightNo,
  duration,
  animated = true,
  className,
}: {
  from: string;
  to: string;
  fromLabel?: string;
  toLabel?: string;
  flightNo?: string;
  duration?: string;
  animated?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative rounded-xl border border-border bg-card p-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <Endpoint code={from} label={fromLabel} align="left" />
        <div className="relative flex-1 mx-2 h-12">
          <svg viewBox="0 0 200 48" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="route-grad" x1="0" x2="1">
                <stop offset="0" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                <stop offset="0.5" stopColor="hsl(var(--accent))" stopOpacity="0.9" />
                <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
              </linearGradient>
            </defs>
            <path
              d="M 4 38 Q 100 -10 196 38"
              fill="none"
              stroke="url(#route-grad)"
              strokeWidth="1.5"
              strokeDasharray="3 4"
            />
            <circle cx="4" cy="38" r="2.5" fill="hsl(var(--primary))" />
            <circle cx="196" cy="38" r="2.5" fill="hsl(var(--primary))" />
          </svg>
          <div className={cn("absolute top-0 -mt-1", animated && "animate-plane")} style={{ left: 0, width: "100%" }}>
            <Plane className="h-4 w-4 text-[hsl(var(--accent))] -rotate-12 drop-shadow" />
          </div>
        </div>
        <Endpoint code={to} label={toLabel} align="right" />
      </div>
      {(flightNo || duration) && (
        <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-mono">{flightNo}</span>
          <span>{duration}</span>
        </div>
      )}
    </div>
  );
}

function Endpoint({ code, label, align }: { code: string; label?: string; align: "left" | "right" }) {
  return (
    <div className={cn("min-w-[64px]", align === "right" && "text-right")}>
      <p className="font-mono text-lg font-semibold tracking-tight">{code}</p>
      {label && <p className="text-[11px] text-muted-foreground truncate">{label}</p>}
    </div>
  );
}
