import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { BrandHeader } from "@/components/BrandHeader";
import { MissionCard } from "@/components/MissionCard";
import { useMissions } from "@/lib/store";
import type { MissionStatus } from "@/lib/types";
import { Activity, AlertTriangle, CheckCircle2, Clock4, PackageCheck, Filter, ArrowUpRight, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

const FILTERS: { id: MissionStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "green", label: "On track" },
  { id: "yellow", label: "Review" },
  { id: "red", label: "Blocked" },
  { id: "delay", label: "Delays" },
  { id: "complete", label: "Delivered" },
];

export default function Ops() {
  const missions = useMissions();
  const [filter, setFilter] = useState<MissionStatus | "all">("all");

  const stats = useMemo(() => ({
    active: missions.filter((m) => m.status !== "complete" && m.status !== "red").length,
    review: missions.filter((m) => m.status === "yellow").length,
    blocked: missions.filter((m) => m.status === "red").length,
    delays: missions.filter((m) => m.status === "delay").length,
    delivered: missions.filter((m) => m.status === "complete").length,
  }), [missions]);

  const filtered = useMemo(
    () => (filter === "all" ? missions : missions.filter((m) => m.status === filter)),
    [missions, filter],
  );

  const exceptions = missions.filter((m) => m.status === "yellow" || m.status === "red" || m.status === "delay");

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />

      <div className="container py-6 sm:py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Operations</h1>
            <p className="text-muted-foreground">Every mission. Every risk. Every next action.</p>
          </div>
          <Link
            to="/shipper"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            New mission <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3 stagger">
          <Stat Icon={Activity} label="Active" value={stats.active} tone="primary" />
          <Stat Icon={AlertTriangle} label="Review needed" value={stats.review} tone="warn" />
          <Stat Icon={AlertTriangle} label="Blocked" value={stats.blocked} tone="danger" />
          <Stat Icon={Clock4} label="Delays" value={stats.delays} tone="info" />
          <Stat Icon={CheckCircle2} label="Delivered" value={stats.delivered} tone="success" />
        </div>

        <div className="mt-7 grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider">Missions</h2>
              <div className="flex items-center gap-1 overflow-x-auto -mx-1 px-1">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold border transition-colors",
                      filter === f.id
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-card border-border hover:bg-secondary",
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 stagger">
              {filtered.map((m) => (
                <MissionCard key={m.id} mission={m} />
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-2 py-8 text-center">No missions match this filter.</p>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3">Risk alerts</h2>
              {exceptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active risks. Nice and quiet.</p>
              ) : (
                <ul className="space-y-2.5">
                  {exceptions.map((m) => (
                    <li key={m.id}>
                      <Link
                        to={`/mission/${m.id}`}
                        className="block rounded-xl border border-border bg-card p-3 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-muted-foreground">{m.shortId}</span>
                          <Pill status={m.status} />
                        </div>
                        <p className="mt-1 text-sm font-semibold leading-tight">{m.item.name}</p>
                        <p className="text-xs text-muted-foreground">{m.notes ?? `${m.pickup.city} → ${m.delivery.city}`}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3">Flight watch</h2>
              <ul className="space-y-2 text-sm">
                {missions.filter((m) => m.flight).slice(0, 4).map((m) => (
                  <li key={m.id} className="flex items-center gap-2.5">
                    <Plane className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
                    <span className="font-mono text-[11px] tracking-wider">{m.flight!.number}</span>
                    <span className="text-muted-foreground truncate">{m.pickup.airport} → {m.delivery.airport}</span>
                    <span className={cn(
                      "ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                      m.flight!.status === "delayed" ? "bg-[hsl(var(--warn)/0.18)] text-[hsl(30_70%_30%)]" : "bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))]",
                    )}>{m.flight!.status}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-primary text-primary-foreground p-5 overflow-hidden relative">
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[hsl(var(--accent)/0.5)] blur-3xl" />
              <div className="relative">
                <PackageCheck className="h-6 w-6 text-[hsl(var(--accent))]" />
                <p className="mt-2 text-sm font-semibold">Proof Packs sealed today</p>
                <p className="mt-1 font-mono text-4xl font-bold">{stats.delivered.toString().padStart(2, "0")}</p>
                <p className="mt-1 text-xs text-primary-foreground/70">Each one tamper-evident and downloadable.</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ Icon, label, value, tone }: { Icon: React.ComponentType<{ className?: string }>; label: string; value: number; tone: "primary" | "warn" | "danger" | "info" | "success" }) {
  const toneCls = {
    primary: "bg-primary/10 text-primary",
    warn: "bg-[hsl(var(--warn)/0.18)] text-[hsl(30_70%_30%)]",
    danger: "bg-[hsl(var(--danger)/0.12)] text-[hsl(var(--danger))]",
    info: "bg-[hsl(220_80%_55%/0.12)] text-[hsl(220_80%_42%)]",
    success: "bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))]",
  }[tone];
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-lg", toneCls)}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="font-mono text-2xl font-bold tracking-tight">{value}</span>
      </div>
      <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
    </div>
  );
}

function Pill({ status }: { status: MissionStatus }) {
  const map: Record<MissionStatus, { label: string; cls: string }> = {
    green: { label: "Track", cls: "bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))]" },
    yellow: { label: "Review", cls: "bg-[hsl(var(--warn)/0.18)] text-[hsl(30_70%_30%)]" },
    red: { label: "Blocked", cls: "bg-[hsl(var(--danger)/0.12)] text-[hsl(var(--danger))]" },
    complete: { label: "Sealed", cls: "bg-primary/10 text-primary" },
    delay: { label: "Delay", cls: "bg-[hsl(220_80%_55%/0.12)] text-[hsl(220_80%_42%)]" },
  };
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", map[status].cls)}>{map[status].label}</span>;
}
