import { cn } from "@/lib/utils";
import type { MissionStatus } from "@/lib/types";
import { CheckCircle2, AlertTriangle, XCircle, PackageCheck, Clock4 } from "lucide-react";

const MAP: Record<
  MissionStatus,
  { label: string; cls: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  green: { label: "On track", cls: "bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))]", Icon: CheckCircle2 },
  yellow: { label: "Review needed", cls: "bg-[hsl(var(--warn)/0.15)] text-[hsl(30_70%_30%)]", Icon: AlertTriangle },
  red: { label: "Cannot move", cls: "bg-[hsl(var(--danger)/0.12)] text-[hsl(var(--danger))]", Icon: XCircle },
  complete: { label: "Delivered", cls: "bg-primary/10 text-primary", Icon: PackageCheck },
  delay: { label: "Delay handled", cls: "bg-[hsl(220_80%_55%/0.12)] text-[hsl(220_80%_42%)]", Icon: Clock4 },
};

export function StatusBadge({ status, className }: { status: MissionStatus; className?: string }) {
  const { label, cls, Icon } = MAP[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-tight",
        cls,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

export function VerifiedBadge({ label = "REAiL Verified" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-primary/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
        <path d="M12 1l3.09 1.79L18 1.83l1.1 2.92 2.91 1.1-.99 3.08L22 12l-1.97 3.08.98 3.08-2.91 1.1L17 22.17l-2.91-.96L12 23l-3.09-1.79L6 22.17l-1.1-2.92L1.99 18.16 3 15.08 1 12l1.97-3.08L1.99 5.84l2.91-1.1L6 1.83l2.91.96L12 1zm-1 13.41L7.41 11l-1.41 1.41L11 17.41 19 9.41 17.59 8 11 14.41z" />
      </svg>
      {label}
    </span>
  );
}
