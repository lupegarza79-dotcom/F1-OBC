import { cn } from "@/lib/utils";
import type { TimelineStep } from "@/lib/types";
import { Check } from "lucide-react";

export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="relative">
      {steps.map((step, i) => {
        const done = step.status === "done";
        const active = step.status === "active";
        const last = i === steps.length - 1;
        return (
          <li key={step.id} className="relative flex gap-3 pb-4 last:pb-0">
            {!last && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[11px] top-6 h-[calc(100%-12px)] w-px",
                  done ? "bg-[hsl(var(--success))]" : "bg-border",
                )}
              />
            )}
            <span
              className={cn(
                "relative mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full ring-4",
                done && "bg-[hsl(var(--success))] text-white ring-[hsl(var(--success)/0.15)]",
                active && "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] ring-[hsl(var(--accent)/0.25)]",
                !done && !active && "bg-background text-muted-foreground ring-border border border-border",
              )}
            >
              {done ? (
                <Check className="h-3 w-3" />
              ) : active ? (
                <span className="relative h-2 w-2 rounded-full bg-current">
                  <span className="absolute inset-0 rounded-full bg-current opacity-50 animate-ping" />
                </span>
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-current/40" />
              )}
            </span>
            <div className="min-w-0 flex-1 pb-1">
              <div className="flex items-baseline justify-between gap-3">
                <p
                  className={cn(
                    "text-sm font-semibold leading-tight",
                    !done && !active && "text-muted-foreground font-medium",
                  )}
                >
                  {step.label}
                </p>
                {step.time && <span className="font-mono text-[11px] text-muted-foreground">{step.time}</span>}
              </div>
              {step.detail && (
                <p className={cn("text-xs mt-0.5", active ? "text-foreground/80" : "text-muted-foreground")}>
                  {step.detail}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
