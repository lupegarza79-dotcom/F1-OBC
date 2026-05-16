import { Link } from "react-router-dom";
import { ArrowRight, Plane } from "lucide-react";
import type { Mission } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";

export function MissionCard({ mission, compact = false }: { mission: Mission; compact?: boolean }) {
  return (
    <Link
      to={`/mission/${mission.id}`}
      className={cn(
        "group block rounded-xl border border-border bg-card p-4 transition-all",
        "hover:border-primary/30 hover:shadow-[0_8px_30px_-12px_hsl(222_55%_14%/0.18)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold tracking-wider text-muted-foreground">
              {mission.shortId}
            </span>
            <StatusBadge status={mission.status} />
          </div>
          <h3 className="mt-1.5 truncate text-[15px] font-semibold text-foreground">
            {mission.item.name}
          </h3>
          <p className="truncate text-xs text-muted-foreground">{mission.item.type}</p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm">
        <span className="font-semibold">{mission.pickup.city}</span>
        <div className="flex-1 relative h-px bg-border">
          <Plane className="absolute -top-2 left-1/2 -translate-x-1/2 h-3.5 w-3.5 rotate-45 text-[hsl(var(--accent))]" />
        </div>
        <span className="font-semibold">{mission.delivery.city}</span>
      </div>

      {!compact && (
        <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
          <Cell label="Deadline" value={mission.delivery.deadline} />
          <Cell label="Courier" value={mission.courier?.name ?? "—"} />
          <Cell label="Mission" value={mission.price.total ? `$${mission.price.total.toLocaleString()}` : "Hold"} />
        </div>
      )}
    </Link>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-secondary/50 px-2 py-1.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="truncate text-xs font-medium text-foreground">{value}</p>
    </div>
  );
}
