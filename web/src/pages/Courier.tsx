import { useState } from "react";
import { BrandHeader } from "@/components/BrandHeader";
import { COURIER_MISSION_PING } from "@/lib/mockData";
import {
  ArrowRight, ArrowLeft, Check, ShieldCheck, Plane, MapPin, Wallet, Globe2, Clock, Star, X, CalendarClock, Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const STEPS = [
  "Profile",
  "Identity",
  "Travel eligibility",
  "Availability",
  "Shipment types",
  "Payout",
  "Qualification",
  "Mission ping",
];

const COUNTRIES = ["USA", "Canada", "Mexico", "EU (Schengen)", "UK", "Japan", "Singapore"];
const SHIPMENT_TYPES = ["Documents", "Small parts", "Electronics", "Automotive", "Medical (non-hazmat)", "Prototypes", "High-value items"];

export default function Courier() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [airport, setAirport] = useState("");
  const [idVerified, setIdVerified] = useState(false);
  const [livenessVerified, setLivenessVerified] = useState(false);
  const [passportOk, setPassportOk] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(["USA", "Mexico", "Canada"]);
  const [availableNow, setAvailableNow] = useState(true);
  const [maxHours, setMaxHours] = useState(36);
  const [types, setTypes] = useState<string[]>(["Documents", "Small parts", "Electronics", "Automotive"]);
  const [payoutOk, setPayoutOk] = useState(false);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      <div className="container max-w-3xl py-8 sm:py-10">
        {/* Stepper */}
        <div className="mb-7">
          <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-2">
            <span>Step {step + 1} of {STEPS.length}</span>
            <span>{STEPS[step]}</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-[hsl(var(--accent))] transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>

        <div key={step} className="animate-rise">
          {step === 0 && (
            <Pane title="Create your courier profile" sub="Basic info so we can match you with missions.">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full name"><Input value={name} onChange={setName} placeholder="Marcus Tate" /></Field>
                <Field label="Email"><Input value={email} onChange={setEmail} placeholder="marcus@example.com" /></Field>
                <Field label="Home city"><Input value={city} onChange={setCity} placeholder="Detroit, MI" /></Field>
                <Field label="Closest airport"><Input value={airport} onChange={setAirport} placeholder="DTW" /></Field>
              </div>
            </Pane>
          )}

          {step === 1 && (
            <Pane title="Verify your identity" sub="Required by airlines, customs, and shippers.">
              <div className="grid sm:grid-cols-3 gap-3 stagger">
                <VerifyCard ok={idVerified} onClick={() => setIdVerified(true)} label="Government ID" Icon={ShieldCheck} />
                <VerifyCard ok={passportOk} onClick={() => setPassportOk(true)} label="Passport" Icon={Globe2} />
                <VerifyCard ok={livenessVerified} onClick={() => setLivenessVerified(true)} label="Selfie / liveness" Icon={Star} />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">REAiL identity layer · powered by F1. Encrypted at rest.</p>
            </Pane>
          )}

          {step === 2 && (
            <Pane title="Where can you travel?" sub="Pick the countries you can legally enter.">
              <div className="flex flex-wrap gap-2">
                {COUNTRIES.map((c) => {
                  const on = selectedCountries.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggle(selectedCountries, setSelectedCountries, c)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-sm font-medium border transition-colors",
                        on ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border hover:bg-secondary",
                      )}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </Pane>
          )}

          {step === 3 && (
            <Pane title="When are you available?" sub="You can change this anytime.">
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setAvailableNow(true)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-colors",
                    availableNow ? "border-primary bg-primary/5 ring-2 ring-primary/10" : "border-border bg-card hover:bg-secondary",
                  )}
                >
                  <Clock className="h-5 w-5 mb-2 text-[hsl(var(--accent))]" />
                  <p className="font-semibold">Available now</p>
                  <p className="text-xs text-muted-foreground">Receive mission pings within 2 hours.</p>
                </button>
                <button
                  onClick={() => setAvailableNow(false)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-colors",
                    !availableNow ? "border-primary bg-primary/5 ring-2 ring-primary/10" : "border-border bg-card hover:bg-secondary",
                  )}
                >
                  <CalendarClock className="h-5 w-5 mb-2 text-[hsl(var(--accent))]" />
                  <p className="font-semibold">Schedule later</p>
                  <p className="text-xs text-muted-foreground">Set windows for specific days.</p>
                </button>
              </div>
              <Field label={`Max mission duration: ${maxHours} hours`}>
                <input type="range" min={6} max={72} value={maxHours} onChange={(e) => setMaxHours(Number(e.target.value))} className="w-full accent-[hsl(var(--accent))]" />
              </Field>
            </Pane>
          )}

          {step === 4 && (
            <Pane title="What can you carry?" sub="Pick the shipment types you're comfortable with.">
              <div className="grid sm:grid-cols-2 gap-2">
                {SHIPMENT_TYPES.map((t) => {
                  const on = types.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggle(types, setTypes, t)}
                      className={cn(
                        "flex items-center justify-between rounded-xl border p-3.5 text-left transition-colors",
                        on ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-secondary",
                      )}
                    >
                      <span className="font-medium">{t}</span>
                      <span className={cn(
                        "h-5 w-5 rounded-md inline-flex items-center justify-center",
                        on ? "bg-primary text-primary-foreground" : "border border-border",
                      )}>
                        {on && <Check className="h-3.5 w-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Pane>
          )}

          {step === 5 && (
            <Pane title="Get paid" sub="We never ask you to pay for the flight.">
              <div className="grid sm:grid-cols-3 gap-3">
                <VerifyCard ok={payoutOk} onClick={() => setPayoutOk(true)} label="Bank account" Icon={Building2} />
                <VerifyCard ok={false} onClick={() => {}} label="Debit card (instant)" Icon={Wallet} />
                <VerifyCard ok={false} onClick={() => {}} label="Tax info" Icon={ShieldCheck} />
              </div>
              <div className="mt-4 rounded-xl bg-[hsl(var(--accent)/0.1)] p-3 text-sm">
                <strong>You do not pay for the flight.</strong> F1 books the route after the mission is approved.
                Payout is released after Proof Pack is sealed.
              </div>
            </Pane>
          )}

          {step === 6 && (
            <Qualification
              ok={idVerified && livenessVerified && passportOk && payoutOk}
              missing={[
                !idVerified && "Government ID",
                !livenessVerified && "Selfie / liveness",
                !passportOk && "Passport",
                !payoutOk && "Bank payout",
              ].filter(Boolean) as string[]}
              countries={selectedCountries}
            />
          )}

          {step === 7 && (
            <MissionPing />
          )}
        </div>

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            onClick={() => (step === 0 ? history.back() : setStep((s) => s - 1))}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Pane({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
      {sub && <p className="text-muted-foreground mt-1 mb-6">{sub}</p>}
      <div>{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mt-4">
      <span className="block text-sm font-semibold mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-[15px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
    />
  );
}

function VerifyCard({ ok, onClick, label, Icon }: { ok: boolean; onClick: () => void; label: string; Icon: React.ComponentType<{ className?: string }> }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
        ok ? "border-[hsl(var(--success))] bg-[hsl(var(--success)/0.06)]" : "border-border bg-card hover:bg-secondary",
      )}
    >
      <span className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg",
        ok ? "bg-[hsl(var(--success))] text-white" : "bg-secondary text-foreground",
      )}>
        {ok ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
      </span>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-[11px] text-muted-foreground">{ok ? "Verified" : "Tap to verify"}</p>
    </button>
  );
}

function Qualification({ ok, missing, countries }: { ok: boolean; missing: string[]; countries: string[] }) {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{ok ? "You qualify!" : "Almost there"}</h1>
      <p className="text-muted-foreground mt-1 mb-6">
        {ok ? "You're eligible for the routes below." : "Complete these items and you're in."}
      </p>

      {ok ? (
        <div className="rounded-2xl border border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.05)] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--success))]">You qualify for</p>
          <ul className="mt-3 space-y-2">
            {countries.map((c) => (
              <li key={c} className="flex items-center gap-2"><Check className="h-4 w-4 text-[hsl(var(--success))]" /><span className="font-medium">{c}</span></li>
            ))}
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[hsl(var(--success))]" /><span className="font-medium">Cross-border (USA ↔ MX ↔ CA)</span></li>
          </ul>
        </div>
      ) : (
        <div className="rounded-2xl border border-[hsl(var(--warn)/0.4)] bg-[hsl(var(--warn)/0.08)] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(30_70%_30%)]">You are missing</p>
          <ul className="mt-3 space-y-2">
            {missing.map((m) => (
              <li key={m} className="flex items-center gap-2"><X className="h-4 w-4 text-[hsl(var(--danger))]" /><span className="font-medium">{m}</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MissionPing() {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const p = COURIER_MISSION_PING;

  if (accepted) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--success))]">Mission accepted</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{p.route}</h1>
          <ol className="mt-5 space-y-3">
            <PingStep n="1" t="Head to pickup" d="1421 Rosa Parks Blvd, Detroit · in 90 min · L. Martinez +1 313 555 0148" />
            <PingStep n="2" t="Confirm pickup" d="Photo + tamper seal · contactless allowed" />
            <PingStep n="3" t="Airport check-in" d="DTW · Terminal McNamara · carry-on · AM 0407 boards 14:25" />
            <PingStep n="4" t="Customs pack" d="Pre-filled by F1 · show on arrival in MTY" />
            <PingStep n="5" t="Deliver to receiver" d="Av. Constitución 200 · R. Salinas · sign + photo" />
          </ol>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => navigate("/mission/m-7421")} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Open live mission</button>
            <button className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-secondary">F1 Support</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--accent))] mb-1">Urgent mission · just arrived</p>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{p.route}</h1>
      <p className="text-muted-foreground">{p.itemType} · pickup in {p.pickupInMin} min</p>

      <div className="mt-5 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Payout</p>
            <p className="font-mono text-3xl font-bold">${p.payout}</p>
            <p className="text-xs text-muted-foreground">Released after Proof Pack sealed</p>
          </div>
          <div className="rounded-lg bg-[hsl(var(--accent)/0.12)] px-3 py-2 text-xs font-semibold text-[hsl(30_70%_30%)]">
            <Plane className="inline h-3.5 w-3.5 mr-1" />
            F1 books your flight
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-secondary/50 p-3 text-sm">
          <p className="font-mono text-xs text-muted-foreground">FLIGHT</p>
          <p className="font-semibold">{p.flight}</p>
        </div>

        <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
          {p.requirements.map((r) => (
            <li key={r.label} className="flex items-center gap-2 rounded-md bg-[hsl(var(--success)/0.08)] px-2.5 py-1.5">
              <Check className="h-4 w-4 text-[hsl(var(--success))]" />
              {r.label}
            </li>
          ))}
        </ul>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold hover:bg-secondary">Pass</button>
          <button onClick={() => setAccepted(true)} className="rounded-xl bg-[hsl(var(--accent))] px-4 py-3 text-sm font-bold text-[hsl(var(--accent-foreground))] glow-amber">Accept mission</button>
        </div>
      </div>
    </div>
  );
}

function PingStep({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <li className="flex gap-3">
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{n}</span>
      <div>
        <p className="font-semibold leading-tight">{t}</p>
        <p className="text-xs text-muted-foreground">{d}</p>
      </div>
    </li>
  );
}
