import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrandHeader } from "@/components/BrandHeader";
import { RouteVisual } from "@/components/RouteVisual";
import {
  FileText, Package, Cpu, Wrench, Cog, HeartPulse, Lightbulb, MoreHorizontal,
  ArrowRight, ArrowLeft, Check, AlertTriangle, XCircle, Shield, Sparkles, CreditCard, Star, Plane,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FLIGHT_OPTIONS } from "@/lib/mockData";
import { missionStore } from "@/lib/store";
import type { Mission } from "@/lib/types";

const ITEM_TYPES = [
  { id: "documents", label: "Documents", Icon: FileText },
  { id: "small", label: "Small item", Icon: Package },
  { id: "electronics", label: "Electronics", Icon: Cpu },
  { id: "automotive", label: "Automotive part", Icon: Wrench },
  { id: "motor", label: "Motor / machine", Icon: Cog },
  { id: "medical", label: "Medical device", Icon: HeartPulse },
  { id: "prototype", label: "Prototype", Icon: Lightbulb },
  { id: "other", label: "Other", Icon: MoreHorizontal },
];

const DEADLINES = ["Today", "12 hours", "24 hours", "48 hours", "Flexible"];

const STEP_LABELS = [
  "What are you moving?",
  "Pickup & delivery",
  "AI Pre-Check",
  "Route & courier",
  "Choose your option",
  "Approve & pay",
];

type Form = {
  itemType: string;
  itemName: string;
  qty: string;
  weightKg: string;
  valueUsd: string;
  notes: string;
  pickupAddr: string;
  pickupContact: string;
  pickupTime: string;
  deliveryAddr: string;
  receiverContact: string;
  deadline: string;
  selectedOption: "fastest" | "value" | "secure";
};

const DEFAULT_FORM: Form = {
  itemType: "automotive",
  itemName: "",
  qty: "1",
  weightKg: "",
  valueUsd: "",
  notes: "",
  pickupAddr: "",
  pickupContact: "",
  pickupTime: "Today, 11:30",
  deliveryAddr: "",
  receiverContact: "",
  deadline: "24 hours",
  selectedOption: "fastest",
};

export default function Shipper() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(DEFAULT_FORM);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const canNext = useMemo(() => {
    if (step === 0) return !!form.itemType && form.itemName.trim().length > 0;
    if (step === 1) return form.pickupAddr.trim().length > 2 && form.deliveryAddr.trim().length > 2;
    return true;
  }, [step, form]);

  const precheck = useMemo(() => computePrecheck(form), [form]);

  function submit() {
    const opt = FLIGHT_OPTIONS.find((o) => o.id === form.selectedOption)!;
    const id = `m-${Math.floor(1000 + Math.random() * 8999)}`;
    const shortId = `F1-${Math.floor(1000 + Math.random() * 8999)}`;
    const mission: Mission = {
      id,
      shortId,
      status: precheck.light === "red" ? "red" : precheck.light === "yellow" ? "yellow" : "green",
      createdAt: new Date().toISOString(),
      item: {
        type: ITEM_TYPES.find((t) => t.id === form.itemType)?.label ?? "Item",
        name: form.itemName || "Urgent shipment",
        weightKg: Number(form.weightKg) || undefined,
        valueUsd: Number(form.valueUsd) || undefined,
        notes: form.notes || undefined,
      },
      pickup: { address: form.pickupAddr, contact: form.pickupContact, city: opt.from, airport: opt.from, window: form.pickupTime },
      delivery: { address: form.deliveryAddr, contact: form.receiverContact, city: opt.to, airport: opt.to, deadline: form.deadline },
      courier: { name: "Marcus T.", initials: "MT", rating: 4.96, trips: 213, verified: true },
      flight: {
        number: opt.flightNo, carrier: opt.carrier, from: opt.from, to: opt.to,
        departLocal: opt.departLocal, arriveLocal: opt.arriveLocal, status: "booked",
      },
      price: {
        courier: Math.round(opt.price * 0.47),
        flight: Math.round(opt.price * 0.34),
        ground: Math.round(opt.price * 0.05),
        compliance: Math.round(opt.price * 0.03),
        insurance: Math.round(opt.price * 0.025),
        platform: Math.round(opt.price * 0.075),
        total: opt.price,
      },
      precheck: {
        light: precheck.light,
        flags: precheck.flags,
      },
      timeline: makeTimeline(2),
      proof: {
        sealed: false,
        items: [
          { label: "Pickup photo", ok: false },
          { label: "Item seal photo", ok: false },
          { label: "Boarding pass", ok: false },
          { label: "Delivery photo", ok: false },
          { label: "Receiver signature", ok: false },
          { label: "Chain of custody log", ok: false },
        ],
      },
    };
    missionStore.add(mission);
    navigate(`/mission/${id}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      <div className="container max-w-3xl py-8 sm:py-10">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            <span>Step {step + 1} of {STEP_LABELS.length}</span>
            <span>{Math.round(((step + 1) / STEP_LABELS.length) * 100)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-[hsl(var(--accent))] transition-all"
              style={{ width: `${((step + 1) / STEP_LABELS.length) * 100}%` }}
            />
          </div>
          <h1 className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight">{STEP_LABELS[step]}</h1>
          <p className="text-muted-foreground mt-1">{stepHelper(step)}</p>
        </div>

        <div key={step} className="animate-rise">
          {step === 0 && (
            <Step0 form={form} set={set} />
          )}
          {step === 1 && (
            <Step1 form={form} set={set} />
          )}
          {step === 2 && (
            <Step2 precheck={precheck} />
          )}
          {step === 3 && (
            <Step3 />
          )}
          {step === 4 && (
            <Step4 selected={form.selectedOption} onSelect={(v) => set("selectedOption", v)} />
          )}
          {step === 5 && (
            <Step5 form={form} onSubmit={submit} />
          )}
        </div>

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            onClick={() => (step === 0 ? navigate("/") : setStep((s) => s - 1))}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < STEP_LABELS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold transition-transform",
                canNext
                  ? "bg-primary text-primary-foreground hover:-translate-y-0.5"
                  : "bg-secondary text-muted-foreground cursor-not-allowed",
              )}
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={submit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[hsl(var(--accent))] px-5 py-2.5 text-sm font-bold text-[hsl(var(--accent-foreground))] glow-amber hover:-translate-y-0.5 transition-transform"
            >
              Approve Mission
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function stepHelper(step: number) {
  switch (step) {
    case 0: return "Tell us what you're sending. Photos and rough numbers are fine — we confirm before dispatch.";
    case 1: return "Where to pick up, where to deliver, and how fast you need it.";
    case 2: return "We check size, weight, restricted goods, and required documents.";
    case 3: return "Searching verified couriers and the safest fastest route.";
    case 4: return "Three options. Same trust. Different priorities.";
    case 5: return "Your payment covers courier, flight, tracking, compliance, and proof.";
    default: return "";
  }
}

function Step0({ form, set }: { form: Form; set: <K extends keyof Form>(k: K, v: Form[K]) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <Label>What type of item?</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 stagger">
          {ITEM_TYPES.map(({ id, label, Icon }) => {
            const active = form.itemType === id;
            return (
              <button
                key={id}
                onClick={() => set("itemType", id)}
                className={cn(
                  "group flex flex-col items-start gap-2 rounded-xl border p-3.5 text-left transition-all",
                  active
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-card hover:border-primary/30 hover:bg-secondary/40",
                )}
              >
                <span className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-lg",
                  active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground",
                )}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold leading-tight">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Item name" hint="Plain English — we'll confirm details.">
          <input
            value={form.itemName}
            onChange={(e) => set("itemName", e.target.value)}
            placeholder="e.g. Engine sensor module"
            className="rork-input"
          />
        </Field>
        <Field label="Quantity">
          <input
            value={form.qty}
            onChange={(e) => set("qty", e.target.value)}
            type="number"
            min={1}
            className="rork-input"
          />
        </Field>
        <Field label="Weight (kg)" hint="Estimate is OK.">
          <input
            value={form.weightKg}
            onChange={(e) => set("weightKg", e.target.value)}
            inputMode="decimal"
            placeholder="1.8"
            className="rork-input"
          />
        </Field>
        <Field label="Declared value (USD)">
          <input
            value={form.valueUsd}
            onChange={(e) => set("valueUsd", e.target.value)}
            inputMode="numeric"
            placeholder="1450"
            className="rork-input"
          />
        </Field>
      </div>

      <Field label="Notes for the courier (optional)">
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={3}
          placeholder="Anti-static bag. Keep upright."
          className="rork-input resize-none"
        />
      </Field>

      <Helper>
        <Sparkles className="h-4 w-4" />
        Don't know the weight or size? Estimate. We confirm before dispatch.
      </Helper>

      <style>{`.rork-input { width: 100%; border: 1px solid hsl(var(--border)); background: hsl(var(--card)); border-radius: 10px; padding: 10px 12px; font-size: 15px; outline: none; transition: border-color .15s, box-shadow .15s; }
      .rork-input:focus { border-color: hsl(var(--primary)); box-shadow: 0 0 0 3px hsl(var(--primary)/0.12); }`}</style>
    </div>
  );
}

function Step1({ form, set }: { form: Form; set: <K extends keyof Form>(k: K, v: Form[K]) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Pickup address">
          <input value={form.pickupAddr} onChange={(e) => set("pickupAddr", e.target.value)} placeholder="1421 Rosa Parks Blvd, Detroit, MI" className="rork-input" />
        </Field>
        <Field label="Pickup contact">
          <input value={form.pickupContact} onChange={(e) => set("pickupContact", e.target.value)} placeholder="Name · phone" className="rork-input" />
        </Field>
        <Field label="Pickup appointment">
          <input value={form.pickupTime} onChange={(e) => set("pickupTime", e.target.value)} className="rork-input" />
        </Field>
        <Field label="Delivery deadline">
          <div className="flex flex-wrap gap-2">
            {DEADLINES.map((d) => (
              <button
                key={d}
                onClick={() => set("deadline", d)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium border transition-colors",
                  form.deadline === d
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-card border-border text-foreground hover:bg-secondary",
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Delivery address">
          <input value={form.deliveryAddr} onChange={(e) => set("deliveryAddr", e.target.value)} placeholder="Av. Constitución 200, Monterrey" className="rork-input" />
        </Field>
        <Field label="Receiver contact">
          <input value={form.receiverContact} onChange={(e) => set("receiverContact", e.target.value)} placeholder="Name · phone" className="rork-input" />
        </Field>
      </div>

      <Helper>
        <Shield className="h-4 w-4" />
        Receiver gets a live tracking link automatically. They sign for delivery in one tap.
      </Helper>
    </div>
  );
}

function Step2({ precheck }: { precheck: ReturnType<typeof computePrecheck> }) {
  const { light, flags } = precheck;
  const meta =
    light === "green"
      ? { Icon: Check, label: "Ready to move", cls: "bg-[hsl(var(--success))] text-white", note: "All checks passed. Mission can proceed." }
      : light === "yellow"
      ? { Icon: AlertTriangle, label: "Review needed", cls: "bg-[hsl(var(--warn))] text-[hsl(30_40%_15%)]", note: "We need a document or quick review before dispatch." }
      : { Icon: XCircle, label: "Cannot move as OBC", cls: "bg-[hsl(var(--danger))] text-white", note: "Onboard courier not possible. We'll suggest a safer alternative." };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start gap-4">
          <span className={cn("inline-flex h-12 w-12 items-center justify-center rounded-xl shrink-0", meta.cls)}>
            <meta.Icon className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">AI Pre-Check</p>
            <h3 className="text-xl font-bold tracking-tight">{meta.label}</h3>
            <p className="text-sm text-muted-foreground mt-1">{meta.note}</p>
          </div>
        </div>

        <ul className="mt-5 space-y-2.5">
          {flags.map((f) => (
            <li key={f.label} className="flex items-start gap-3">
              <span className={cn(
                "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                f.level === "ok" && "bg-[hsl(var(--success))] text-white",
                f.level === "warn" && "bg-[hsl(var(--warn))] text-[hsl(30_40%_15%)]",
                f.level === "block" && "bg-[hsl(var(--danger))] text-white",
              )}>
                {f.level === "ok" ? <Check className="h-3 w-3" /> : f.level === "warn" ? <AlertTriangle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight">{f.label}</p>
                {f.note && <p className="text-xs text-muted-foreground mt-0.5">{f.note}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-muted-foreground px-1">
        AI Pre-Check is an initial review. Final clearance is confirmed by our compliance team before dispatch.
      </p>
    </div>
  );
}

function Step3() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="relative flex h-2 w-2"><span className="absolute inset-0 rounded-full bg-[hsl(var(--accent))] animate-ping opacity-75" /><span className="relative h-2 w-2 rounded-full bg-[hsl(var(--accent))]" /></span>
          Live search
        </div>

        <div className="mt-4 space-y-3 stagger">
          <SearchRow label="Verified courier found" detail="Marcus T. · 213 missions · 4.96★" Icon={Star} />
          <SearchRow label="Flight route found" detail="DTW → MTY · non-stop · 3h 47m" Icon={Plane} />
          <SearchRow label="Estimated delivery" detail="Tomorrow, 09:00 local · 7h before deadline" Icon={Check} />
          <SearchRow label="Mission confidence" detail="High · backup route available" Icon={Shield} />
        </div>
      </div>

      <RouteVisual from="DTW" to="MTY" fromLabel="Detroit" toLabel="Monterrey" flightNo="AM 0407" duration="3h 47m" />
    </div>
  );
}

function SearchRow({ label, detail, Icon }: { label: string; detail: string; Icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-secondary/50 px-3 py-2.5">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))]">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-tight">{label}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
      <Check className="h-4 w-4 text-[hsl(var(--success))]" />
    </div>
  );
}

function Step4({ selected, onSelect }: { selected: "fastest" | "value" | "secure"; onSelect: (v: "fastest" | "value" | "secure") => void }) {
  return (
    <div className="grid gap-3 stagger">
      {FLIGHT_OPTIONS.map((opt) => {
        const active = selected === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={cn(
              "text-left rounded-2xl border-2 bg-card p-4 sm:p-5 transition-all",
              active ? "border-primary shadow-[0_20px_60px_-30px_hsl(222_55%_14%/0.4)]" : "border-border hover:border-primary/30",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-tight">{opt.title}</span>
                  {opt.recommended && (
                    <span className="rounded-full bg-[hsl(var(--accent))] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--accent-foreground))]">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{opt.carrier} · {opt.flightNo} · {opt.stops === 0 ? "non-stop" : `${opt.stops} stop`}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xl font-bold tracking-tight">${opt.price.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground">all-in</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2 text-[11px]">
              <Stat label="Pickup ETA" value={`${opt.pickupEtaMin}m`} />
              <Stat label="Delivery ETA" value={`${opt.deliveryEtaHours}h`} />
              <Stat label="Flight" value={`${Math.floor(opt.durationMin / 60)}h ${opt.durationMin % 60}m`} />
              <Stat label="Risk" value={opt.riskLabel} />
            </div>

            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              <li className="inline-flex items-center gap-1"><Check className="h-3 w-3 text-[hsl(var(--success))]" /> Courier payout</li>
              <li className="inline-flex items-center gap-1"><Check className="h-3 w-3 text-[hsl(var(--success))]" /> Flight ticket</li>
              <li className="inline-flex items-center gap-1"><Check className="h-3 w-3 text-[hsl(var(--success))]" /> Ground transport</li>
              <li className="inline-flex items-center gap-1"><Check className="h-3 w-3 text-[hsl(var(--success))]" /> Live tracking</li>
              <li className="inline-flex items-center gap-1"><Check className="h-3 w-3 text-[hsl(var(--success))]" /> Sealed Proof Pack</li>
            </ul>
          </button>
        );
      })}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/60 px-2 py-1.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function Step5({ form, onSubmit }: { form: Form; onSubmit: () => void }) {
  const opt = FLIGHT_OPTIONS.find((o) => o.id === form.selectedOption)!;
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Mission summary</p>
        <h3 className="mt-1 text-lg font-bold tracking-tight">{form.itemName || "Urgent shipment"}</h3>

        <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
          <Row k="Pickup" v={form.pickupAddr || "—"} />
          <Row k="Delivery" v={form.deliveryAddr || "—"} />
          <Row k="Deadline" v={form.deadline} />
          <Row k="Route" v={`${opt.from} → ${opt.to}`} />
          <Row k="Flight" v={`${opt.flightNo} · ${opt.departLocal} → ${opt.arriveLocal}`} />
        </dl>

        <div className="ticket-divider my-5 h-px" />

        <dl className="grid grid-cols-2 gap-y-1.5 text-sm">
          <Row k="Courier payout" v={`$${Math.round(opt.price * 0.47).toLocaleString()}`} muted />
          <Row k="Flight ticket" v={`$${Math.round(opt.price * 0.34).toLocaleString()}`} muted />
          <Row k="Ground transport" v={`$${Math.round(opt.price * 0.05).toLocaleString()}`} muted />
          <Row k="Compliance handling" v={`$${Math.round(opt.price * 0.03).toLocaleString()}`} muted />
          <Row k="Insurance" v={`$${Math.round(opt.price * 0.025).toLocaleString()}`} muted />
          <Row k="Platform fee" v={`$${Math.round(opt.price * 0.075).toLocaleString()}`} muted />
        </dl>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3">
          <span className="text-sm font-semibold">Total</span>
          <span className="font-mono text-xl font-bold tracking-tight">${opt.price.toLocaleString()}</span>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Your payment covers courier, flight, ground transport, tracking, compliance, and a sealed Proof Pack.
          Courier does not pay for the flight — F1 books the route after you approve.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Payment method</p>
        <div className="mt-3 grid sm:grid-cols-4 gap-2">
          {["Card", "ACH", "Wire", "Company account"].map((m, i) => (
            <button
              key={m}
              className={cn(
                "rounded-xl border px-3 py-3 text-sm font-semibold transition-colors",
                i === 0 ? "border-primary bg-primary/5" : "border-border hover:bg-secondary",
              )}
            >
              <CreditCard className="mx-auto mb-1 h-4 w-4" />
              {m}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onSubmit}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-5 py-4 text-base font-bold text-[hsl(var(--accent-foreground))] glow-amber hover:-translate-y-0.5 transition-transform"
      >
        Approve & Pay ${opt.price.toLocaleString()}
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}

function Row({ k, v, muted }: { k: string; v: string; muted?: boolean }) {
  return (
    <>
      <dt className="text-muted-foreground">{k}</dt>
      <dd className={cn("text-right truncate", muted ? "text-muted-foreground" : "font-medium")}>{v}</dd>
    </>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-foreground mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-muted-foreground mt-1">{hint}</span>}
    </label>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold text-foreground mb-2.5">{children}</p>;
}

function Helper({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-start gap-2 rounded-xl bg-[hsl(var(--accent)/0.08)] px-3.5 py-2.5 text-xs text-foreground">
      <span className="text-[hsl(38_96%_40%)] mt-0.5">{(children as React.ReactElement[])?.[0] ?? null}</span>
      <span>{(children as React.ReactElement[])?.[1] ?? children}</span>
    </div>
  );
}

function computePrecheck(form: Form): { light: "green" | "yellow" | "red"; flags: { label: string; level: "ok" | "warn" | "block"; note?: string }[] } {
  const flags: { label: string; level: "ok" | "warn" | "block"; note?: string }[] = [];
  const txt = `${form.itemName} ${form.notes}`.toLowerCase();
  const isLithium = /lithium|battery|battery pack|ups/.test(txt);
  const isLiquid = /liquid|fluid|reagent|fuel/.test(txt);
  const isHazmat = /hazmat|flammable|explosive|aerosol/.test(txt);
  const isMedical = form.itemType === "medical";

  if (isLithium) {
    flags.push({ label: "Lithium battery", level: "block", note: "Cannot move as onboard courier — safer alternative will be offered." });
  } else {
    flags.push({ label: "No restricted goods detected", level: "ok" });
  }

  flags.push({ label: "Carry-on eligible", level: Number(form.weightKg) > 23 ? "warn" : "ok", note: Number(form.weightKg) > 23 ? "Checked baggage may be required." : undefined });

  if (isLiquid) flags.push({ label: "Liquid declaration", level: "warn", note: "Volume and packaging confirmation required." });
  if (isHazmat) flags.push({ label: "Hazmat classification", level: "block", note: "Onboard courier not permitted for hazmat." });
  if (isMedical) flags.push({ label: "Medical non-hazmat", level: "ok", note: "Standard documentation applies." });

  flags.push({ label: "Commercial invoice", level: Number(form.valueUsd) > 800 ? "warn" : "ok", note: Number(form.valueUsd) > 800 ? "Required for customs above $800." : "Not required for declared value." });
  flags.push({ label: "Courier identity verified", level: "ok" });

  const hasBlock = flags.some((f) => f.level === "block");
  const hasWarn = flags.some((f) => f.level === "warn");
  return { light: hasBlock ? "red" : hasWarn ? "yellow" : "green", flags };
}

function makeTimeline(activeIdx: number) {
  const steps = [
    "Mission created", "Payment approved", "Courier matched", "Flight selected", "Flight booked",
    "Courier en route to pickup", "Pickup confirmed", "Courier at airport", "Flight boarded",
    "Flight in air", "Flight landed", "Customs cleared", "Out for delivery", "Receiver confirmed",
    "Proof Pack sealed", "Courier paid",
  ];
  return steps.map((label, i) => ({
    id: `s-${i}`,
    label,
    status: (i < activeIdx ? "done" : i === activeIdx ? "active" : "pending") as "done" | "active" | "pending",
    time: i < activeIdx ? new Date(Date.now() - (activeIdx - i) * 60_000 * 12).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined,
  }));
}
