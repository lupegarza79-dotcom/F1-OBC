import { Link } from "react-router-dom";
import { Package, UserCheck, Inbox, LayoutDashboard, ArrowRight, ShieldCheck, Sparkles, MapPin, FileCheck2, Plane } from "lucide-react";
import { BrandHeader, BrandMark } from "@/components/BrandHeader";

const ROLES = [
  {
    to: "/shipper",
    title: "I need to ship something urgent",
    sub: "Door to door. Cross borders. Today.",
    Icon: Package,
    cta: "Start a mission",
    accent: true,
  },
  {
    to: "/courier",
    title: "I want to become a courier",
    sub: "Carry urgent shipments and get paid.",
    Icon: UserCheck,
    cta: "Sign up to carry",
  },
  {
    to: "/receiver/F1-7421",
    title: "I am receiving a shipment",
    sub: "Track and sign for delivery.",
    Icon: Inbox,
    cta: "Open tracking",
  },
  {
    to: "/ops",
    title: "Operations Dashboard",
    sub: "All missions. All risks. One screen.",
    Icon: LayoutDashboard,
    cta: "Open dashboard",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 brand-grid opacity-[0.35] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background to-background pointer-events-none" />

        <div className="container relative py-14 sm:py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 animate-rise">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <span className="relative flex h-2 w-2"><span className="absolute inset-0 rounded-full bg-[hsl(var(--accent))] animate-ping opacity-75" /><span className="relative h-2 w-2 rounded-full bg-[hsl(var(--accent))]" /></span>
                On-board courier operating system
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
                Cross borders.
                <br />
                Carry urgent.
                <br />
                <span className="text-[hsl(var(--accent))]">Prove every step.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base sm:text-lg text-muted-foreground">
                One app. A verified courier physically carries your shipment from door to door —
                AI plans the route, F1 books the flight, you watch it live.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/shipper"
                  className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-5 py-3 text-[15px] font-semibold text-[hsl(var(--accent-foreground))] glow-amber transition-transform hover:-translate-y-0.5"
                >
                  Ship something urgent
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/ops"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-[15px] font-semibold text-foreground hover:bg-secondary"
                >
                  See it in motion
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground">
                <TrustChip Icon={ShieldCheck} label="Identity verified couriers" />
                <TrustChip Icon={Sparkles} label="AI compliance pre-check" />
                <TrustChip Icon={MapPin} label="Live GPS + flight tracking" />
                <TrustChip Icon={FileCheck2} label="Sealed Proof Pack" />
              </div>
            </div>

            <div className="lg:col-span-5 animate-rise">
              <HeroCard />
            </div>
          </div>
        </div>
      </section>

      {/* Role selector */}
      <section className="container pb-16">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">What do you need to do today?</h2>
            <p className="text-sm text-muted-foreground">Pick one. Plain English. Big buttons.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 stagger">
          {ROLES.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-24px_hsl(222_55%_14%/0.25)] hover:border-primary/30"
            >
              <div className="flex items-start gap-4">
                <span className={
                  r.accent
                    ? "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] glow-amber"
                    : "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"
                }>
                  <r.Icon className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold leading-tight tracking-tight">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.sub}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    {r.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
              <span className="pointer-events-none absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-[hsl(var(--accent)/0.06)] opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-secondary/40">
        <div className="container py-14">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--accent))]">How F1 works</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">One app. Whole mission.</h2>
              <p className="mt-3 text-muted-foreground">
                Like Uber, you only see F1. Flights, payments, identity, customs — handled behind the scenes.
              </p>
            </div>
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-3 stagger">
              {[
                { n: "1", t: "You describe the shipment", d: "Photos, pickup, delivery, deadline." },
                { n: "2", t: "AI checks if it can fly", d: "Green, yellow, or red — clear answer." },
                { n: "3", t: "We match a verified courier", d: "Identity, visa and route confirmed." },
                { n: "4", t: "F1 books the flight", d: "Courier never fronts the ticket." },
                { n: "5", t: "You watch it live", d: "GPS on the ground, flight in the air." },
                { n: "6", t: "Proof Pack is sealed", d: "Tamper-evident PDF + share link." },
              ].map((s) => (
                <div key={s.n} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{s.n}</span>
                    <p className="font-semibold tracking-tight">{s.t}</p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <BrandMark />
          <p className="text-xs text-muted-foreground">
            F1 OnBoard Solutions — Cross borders. Carry urgent. Prove every step.
          </p>
        </div>
      </footer>
    </div>
  );
}

function TrustChip({ Icon, label }: { Icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
      {label}
    </span>
  );
}

function HeroCard() {
  return (
    <div className="relative rounded-2xl border border-border bg-card p-5 shadow-[0_30px_80px_-30px_hsl(222_55%_14%/0.35)] overflow-hidden">
      <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-[hsl(var(--accent)/0.18)] blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] tracking-widest text-muted-foreground">F1-7421 · LIVE</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--success)/0.12)] px-2 py-0.5 text-[11px] font-semibold text-[hsl(var(--success))]">
            <span className="relative flex h-2 w-2"><span className="absolute inset-0 rounded-full bg-[hsl(var(--success))] animate-ping opacity-75" /><span className="relative h-2 w-2 rounded-full bg-[hsl(var(--success))]" /></span>
            On track
          </span>
        </div>

        <h3 className="mt-3 text-lg font-semibold tracking-tight">Engine sensor module</h3>
        <p className="text-xs text-muted-foreground">Automotive part · 1.8 kg · $1,450</p>

        <div className="mt-4 rounded-xl bg-secondary/60 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-base font-bold">DTW</p>
              <p className="text-[11px] text-muted-foreground">Detroit · 14:55</p>
            </div>
            <div className="relative flex-1 h-10 mx-2">
              <svg viewBox="0 0 200 40" className="absolute inset-0 h-full w-full">
                <path d="M4 30 Q100 -8 196 30" fill="none" stroke="hsl(var(--accent))" strokeWidth="1.6" strokeDasharray="3 4" />
                <circle cx="4" cy="30" r="2.5" fill="hsl(var(--primary))" />
                <circle cx="196" cy="30" r="2.5" fill="hsl(var(--primary))" />
              </svg>
              <div className="absolute top-0 animate-plane" style={{ left: 0, width: "100%" }}>
                <Plane className="h-4 w-4 -rotate-12 text-[hsl(var(--accent))]" />
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-base font-bold">MTY</p>
              <p className="text-[11px] text-muted-foreground">Monterrey · 18:42</p>
            </div>
          </div>
        </div>

        <ul className="mt-4 space-y-2 text-sm">
          <Step done label="Payment approved" time="11:02" />
          <Step done label="Courier matched · Marcus T." time="11:04" />
          <Step active label="Courier en route to pickup" time="11:18" />
          <Step label="Customs cleared" />
          <Step label="Delivered & sealed" />
        </ul>
      </div>
    </div>
  );
}

function Step({ label, time, done, active }: { label: string; time?: string; done?: boolean; active?: boolean }) {
  return (
    <li className="flex items-center gap-3">
      <span className={
        done
          ? "inline-flex h-4 w-4 items-center justify-center rounded-full bg-[hsl(var(--success))] text-white"
          : active
          ? "relative inline-flex h-4 w-4 rounded-full bg-[hsl(var(--accent))]"
          : "h-4 w-4 rounded-full border border-border bg-background"
      }>
        {done && <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>}
        {active && <span className="absolute inset-0 rounded-full bg-[hsl(var(--accent))] opacity-50 animate-ping" />}
      </span>
      <span className={done || active ? "font-medium" : "text-muted-foreground"}>{label}</span>
      {time && <span className="ml-auto font-mono text-[11px] text-muted-foreground">{time}</span>}
    </li>
  );
}
