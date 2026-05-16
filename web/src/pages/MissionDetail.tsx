import { useParams, Link, useNavigate } from "react-router-dom";
import { useMission, missionStore } from "@/lib/store";
import { BrandHeader } from "@/components/BrandHeader";
import { Timeline } from "@/components/Timeline";
import { StatusBadge, VerifiedBadge } from "@/components/StatusBadge";
import { RouteVisual } from "@/components/RouteVisual";
import {
  ArrowLeft, Download, Share2, Phone, MessageSquare, ShieldCheck, Lock, FileCheck2, MapPin, Plane, AlertTriangle, Headphones,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function MissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mission = useMission(id);
  const [advancing, setAdvancing] = useState(false);

  if (!mission) {
    return (
      <div className="min-h-screen bg-background">
        <BrandHeader />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Mission not found.</p>
          <button onClick={() => navigate("/")} className="mt-4 text-sm font-semibold underline">Back home</button>
        </div>
      </div>
    );
  }

  function advance() {
    if (!mission) return;
    const idx = mission.timeline.findIndex((s) => s.status === "active");
    if (idx === -1 || idx >= mission.timeline.length - 1) return;
    setAdvancing(true);
    setTimeout(() => {
      const next = mission.timeline.map((s, i) => {
        if (i < idx) return s;
        if (i === idx) return { ...s, status: "done" as const, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
        if (i === idx + 1) return { ...s, status: "active" as const };
        return s;
      });
      missionStore.update(mission.id, { timeline: next });
      setAdvancing(false);
    }, 350);
  }

  function seal() {
    if (!mission) return;
    const next = mission.timeline.map((s) => ({ ...s, status: "done" as const, time: s.time ?? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }));
    missionStore.update(mission.id, {
      status: "complete",
      timeline: next,
      proof: { sealed: true, items: mission.proof.items.map((p) => ({ ...p, ok: true })) },
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />

      <div className="container py-6 sm:py-8 max-w-6xl">
        <Link to="/ops" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All missions
        </Link>

        {/* Header */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground">{mission.shortId}</span>
              <StatusBadge status={mission.status} />
              {mission.courier?.verified && <VerifiedBadge />}
            </div>
            <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight">{mission.item.name}</h1>
            <p className="text-sm text-muted-foreground">
              {mission.item.type} · {mission.pickup.city} → {mission.delivery.city} · Deadline {mission.delivery.deadline}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-secondary">
              <Share2 className="h-4 w-4" /> Share with receiver
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-secondary">
              <Headphones className="h-4 w-4" /> Support
            </button>
          </div>
        </div>

        {/* Status banner */}
        {mission.status === "red" && (
          <Banner tone="danger" Icon={AlertTriangle}>
            AI Pre-Check blocked this mission. Onboard courier is not possible. F1 compliance will contact you with a safer alternative.
          </Banner>
        )}
        {mission.status === "yellow" && (
          <Banner tone="warn" Icon={AlertTriangle}>
            Review needed. {mission.notes ?? "Upload missing documents to continue."}
          </Banner>
        )}
        {mission.status === "delay" && (
          <Banner tone="info" Icon={Plane}>
            {mission.notes ?? "Flight changed — backup route activated. Updated ETA below."}
          </Banner>
        )}

        <div className="mt-6 grid lg:grid-cols-3 gap-5">
          {/* Left: Timeline + map */}
          <div className="lg:col-span-2 space-y-5">
            <Panel title="Live mission" action={
              mission.status !== "complete" && mission.status !== "red" ? (
                <div className="flex gap-2">
                  <button
                    onClick={advance}
                    disabled={advancing}
                    className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
                  >
                    {advancing ? "Updating…" : "Advance step (demo)"}
                  </button>
                  <button onClick={seal} className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary">
                    Seal Proof Pack
                  </button>
                </div>
              ) : null
            }>
              <MapPreview mission={mission} />
              <div className="mt-5">
                <Timeline steps={mission.timeline} />
              </div>
            </Panel>

            <Panel title="Route & flight">
              <RouteVisual
                from={mission.pickup.airport}
                to={mission.delivery.airport}
                fromLabel={mission.pickup.city}
                toLabel={mission.delivery.city}
                flightNo={mission.flight?.number}
                duration={mission.flight ? `${mission.flight.departLocal} → ${mission.flight.arriveLocal}` : undefined}
              />
              {mission.flight && (
                <div className="mt-3 grid sm:grid-cols-4 gap-2 text-[11px]">
                  <Cell label="Carrier" value={mission.flight.carrier} />
                  <Cell label="Status" value={mission.flight.status} highlight />
                  <Cell label="Departs" value={mission.flight.departLocal} />
                  <Cell label="Arrives" value={mission.flight.arriveLocal} />
                </div>
              )}
            </Panel>

            <Panel title="AI Pre-Check">
              <ul className="space-y-2">
                {mission.precheck.flags.map((f) => (
                  <li key={f.label} className="flex items-start gap-3 rounded-lg bg-secondary/40 px-3 py-2">
                    <span className={cn(
                      "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                      f.level === "ok" && "bg-[hsl(var(--success))] text-white",
                      f.level === "warn" && "bg-[hsl(var(--warn))] text-[hsl(30_40%_15%)]",
                      f.level === "block" && "bg-[hsl(var(--danger))] text-white",
                    )}>
                      {f.level === "ok" ? "✓" : f.level === "warn" ? "!" : "×"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-tight">{f.label}</p>
                      {f.note && <p className="text-xs text-muted-foreground mt-0.5">{f.note}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          {/* Right: Courier, Price, Proof */}
          <div className="space-y-5">
            {mission.courier && (
              <Panel title="Your courier">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {mission.courier.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold tracking-tight">{mission.courier.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ★ {mission.courier.rating} · {mission.courier.trips} missions
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                    <ShieldCheck className="h-3 w-3" /> Identity Verified
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                    <MapPin className="h-3 w-3" /> GPS Verified
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                    <Plane className="h-3 w-3" /> Flight Verified
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-secondary">
                    <Phone className="h-4 w-4" /> Call
                  </button>
                  <button className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-secondary">
                    <MessageSquare className="h-4 w-4" /> Message
                  </button>
                </div>
              </Panel>
            )}

            <Panel title="Mission price" subtitle="Held in mission wallet">
              {mission.price.total > 0 ? (
                <>
                  <Line k="Courier payout" v={mission.price.courier} />
                  <Line k="Flight ticket" v={mission.price.flight} note="Booked by F1" />
                  <Line k="Ground transport" v={mission.price.ground} />
                  <Line k="Compliance handling" v={mission.price.compliance} />
                  <Line k="Insurance" v={mission.price.insurance} />
                  <Line k="Platform fee" v={mission.price.platform} />
                  <div className="ticket-divider my-2 h-px" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="font-mono text-lg font-bold">${mission.price.total.toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No charge yet — mission blocked by Pre-Check.</p>
              )}
            </Panel>

            <Panel title="Proof Pack" subtitle={mission.proof.sealed ? "Sealed & tamper-evident" : "Building from each step"}>
              <ul className="space-y-1.5">
                {mission.proof.items.map((p) => (
                  <li key={p.label} className="flex items-center gap-2 text-sm">
                    <span className={cn(
                      "inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold",
                      p.ok ? "bg-[hsl(var(--success))] text-white" : "bg-secondary text-muted-foreground border border-border",
                    )}>
                      {p.ok ? "✓" : "·"}
                    </span>
                    <span className={p.ok ? "" : "text-muted-foreground"}>{p.label}</span>
                  </li>
                ))}
              </ul>

              {mission.proof.sealed ? (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-xs">
                    <Lock className="h-4 w-4 text-primary" />
                    <span className="font-mono">SHA · 7f2c…a91e</span>
                  </div>
                  <button className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
                    <Download className="h-4 w-4" /> Download PDF
                  </button>
                  <button className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-secondary">
                    <FileCheck2 className="h-4 w-4" /> Copy share link
                  </button>
                </div>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">Proof Pack will seal automatically when the mission completes.</p>
              )}
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Banner({ tone, Icon, children }: { tone: "danger" | "warn" | "info"; Icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  const cls =
    tone === "danger"
      ? "bg-[hsl(var(--danger)/0.08)] border-[hsl(var(--danger)/0.3)] text-[hsl(var(--danger))]"
      : tone === "warn"
      ? "bg-[hsl(var(--warn)/0.12)] border-[hsl(var(--warn)/0.35)] text-[hsl(30_70%_28%)]"
      : "bg-[hsl(220_80%_55%/0.08)] border-[hsl(220_80%_55%/0.3)] text-[hsl(220_80%_38%)]";
  return (
    <div className={cn("mt-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm", cls)}>
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <p className="leading-snug">{children}</p>
    </div>
  );
}

function Line({ k, v, note }: { k: string; v: number; note?: string }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-muted-foreground">
        {k}
        {note && <span className="ml-1.5 text-[10px] uppercase tracking-wider text-[hsl(var(--success))]">· {note}</span>}
      </span>
      <span className="font-medium">${v.toLocaleString()}</span>
    </div>
  );
}

function Cell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg bg-secondary/60 px-2.5 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("text-sm font-semibold capitalize", highlight && "text-[hsl(var(--success))]")}>{value}</p>
    </div>
  );
}

function MapPreview({ mission }: { mission: ReturnType<typeof useMission> }) {
  if (!mission) return null;
  const activeIdx = mission.timeline.findIndex((s) => s.status === "active");
  const progress = activeIdx === -1 ? 1 : activeIdx / (mission.timeline.length - 1);
  return (
    <div className="relative h-44 sm:h-52 overflow-hidden rounded-xl border border-border bg-[hsl(218_40%_97%)]">
      <div className="absolute inset-0 brand-grid opacity-60" />
      <svg viewBox="0 0 600 200" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="path-grad" x1="0" x2="1">
            <stop offset="0" stopColor="hsl(var(--primary))" />
            <stop offset="1" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
        <path d="M 40 160 Q 300 -20 560 160" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
        <path
          d="M 40 160 Q 300 -20 560 160"
          fill="none"
          stroke="url(#path-grad)"
          strokeWidth="3"
          strokeDasharray="600"
          strokeDashoffset={600 * (1 - progress)}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
        <circle cx="40" cy="160" r="6" fill="hsl(var(--primary))" />
        <circle cx="560" cy="160" r="6" fill="hsl(var(--primary))" />
      </svg>
      <div className="absolute left-3 bottom-2 rounded-md bg-card/95 backdrop-blur px-2 py-1 text-[11px] font-semibold shadow-sm">
        {mission.pickup.airport} · {mission.pickup.city}
      </div>
      <div className="absolute right-3 bottom-2 rounded-md bg-card/95 backdrop-blur px-2 py-1 text-[11px] font-semibold shadow-sm">
        {mission.delivery.airport} · {mission.delivery.city}
      </div>
      <div
        className="absolute top-1/2 -translate-y-1/2 transition-all duration-700"
        style={{ left: `calc(${4 + progress * 88}% - 12px)` }}
      >
        <div className="relative">
          <span className="absolute inset-0 -m-1 rounded-full bg-[hsl(var(--accent))] opacity-40 blur-sm" />
          <Plane className="relative h-5 w-5 text-[hsl(var(--accent))] -rotate-12 drop-shadow" />
        </div>
      </div>
    </div>
  );
}
