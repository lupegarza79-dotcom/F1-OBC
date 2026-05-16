import { useParams } from "react-router-dom";
import { useMission } from "@/lib/store";
import { BrandHeader } from "@/components/BrandHeader";
import { Timeline } from "@/components/Timeline";
import { StatusBadge } from "@/components/StatusBadge";
import { useState, useRef } from "react";
import { Check, Phone, MessageSquare, MapPin, Camera, PenLine, PackageCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Receiver() {
  const { id } = useParams();
  const mission = useMission(id);
  const [confirmed, setConfirmed] = useState(false);

  if (!mission) {
    return (
      <div className="min-h-screen bg-background">
        <BrandHeader />
        <div className="container py-20 text-center text-muted-foreground">Shipment not found.</div>
      </div>
    );
  }

  const active = mission.timeline.find((s) => s.status === "active");

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />

      <div className="container max-w-xl py-6 sm:py-10">
        <span className="font-mono text-[11px] tracking-widest text-muted-foreground">{mission.shortId}</span>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">A shipment is on its way to you.</h1>
        <p className="text-muted-foreground mt-1">{mission.item.name} · from {mission.pickup.city}</p>

        <div className="mt-5 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</p>
              <p className="text-lg font-bold leading-tight mt-0.5">{active?.label ?? "Delivered"}</p>
              <p className="text-sm text-muted-foreground">{active?.detail ?? "Sealed Proof Pack ready"}</p>
            </div>
            <StatusBadge status={mission.status} />
          </div>

          <div className="mt-4 rounded-xl bg-secondary/50 p-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Estimated arrival</p>
            <p className="text-base font-bold">{mission.delivery.deadline}</p>
            <p className="text-xs text-muted-foreground">{mission.delivery.address}</p>
          </div>
        </div>

        {mission.courier && (
          <div className="mt-4 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">{mission.courier.initials}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{mission.courier.name.split(" ")[0]}</p>
                <p className="text-xs text-muted-foreground">Your courier · ★ {mission.courier.rating}</p>
              </div>
              <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-secondary inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /></button>
              <button className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-secondary inline-flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        )}

        <div className="mt-5 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3">Where it is</h2>
          <Timeline steps={mission.timeline.slice(Math.max(0, mission.timeline.findIndex((s) => s.status === "active") - 2))} />
        </div>

        {confirmed ? (
          <div className="mt-5 rounded-2xl border border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success)/0.06)] p-5 text-center animate-rise">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--success))] text-white">
              <PackageCheck className="h-6 w-6" />
            </span>
            <p className="mt-3 font-semibold text-foreground">Delivery confirmed.</p>
            <p className="text-sm text-muted-foreground">Thank you — the shipper has been notified and the Proof Pack is sealing now.</p>
          </div>
        ) : (
          <ConfirmCard onConfirm={() => setConfirmed(true)} address={mission.delivery.address} />
        )}
      </div>
    </div>
  );
}

function ConfirmCard({ onConfirm, address }: { onConfirm: () => void; address: string }) {
  const [signed, setSigned] = useState(false);
  const [photo, setPhoto] = useState(false);
  const padRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = true;
    const ctx = padRef.current?.getContext("2d");
    if (!ctx) return;
    const rect = padRef.current!.getBoundingClientRect();
    ctx.strokeStyle = "hsl(222 55% 14%)";
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }
  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = padRef.current?.getContext("2d");
    if (!ctx) return;
    const rect = padRef.current!.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setSigned(true);
  }
  function end() { drawing.current = false; }
  function clear() {
    const ctx = padRef.current?.getContext("2d");
    ctx?.clearRect(0, 0, padRef.current!.width, padRef.current!.height);
    setSigned(false);
  }

  const ready = signed; // photo optional
  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-5">
      <h2 className="text-sm font-bold uppercase tracking-wider">Confirm delivery</h2>
      <p className="mt-1 text-sm text-muted-foreground">Sign below when the courier hands over the shipment at <strong>{address}</strong>.</p>

      <div className="mt-4 relative">
        <canvas
          ref={padRef}
          width={520}
          height={150}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          className="w-full h-[150px] rounded-xl border border-dashed border-border bg-[hsl(218_40%_98%)] touch-none cursor-crosshair"
        />
        {!signed && (
          <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground pointer-events-none">
            <PenLine className="h-3.5 w-3.5 mr-1" /> Sign here
          </span>
        )}
        <div className="absolute right-2 top-2">
          <button onClick={clear} className="text-[11px] text-muted-foreground hover:text-foreground underline">Clear</button>
        </div>
      </div>

      <button
        onClick={() => setPhoto(true)}
        className={cn(
          "mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors",
          photo ? "border-[hsl(var(--success))] bg-[hsl(var(--success)/0.08)] text-[hsl(var(--success))]" : "border-border bg-card hover:bg-secondary",
        )}
      >
        {photo ? <Check className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
        {photo ? "Photo attached" : "Add photo (optional)"}
      </button>

      <button
        onClick={onConfirm}
        disabled={!ready}
        className={cn(
          "mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-base font-bold transition-transform",
          ready ? "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] glow-amber hover:-translate-y-0.5" : "bg-secondary text-muted-foreground cursor-not-allowed",
        )}
      >
        Confirm delivery
      </button>

      <p className="mt-2 text-[11px] text-muted-foreground inline-flex items-center gap-1">
        <MapPin className="h-3 w-3" /> GPS captured · timestamped · part of sealed Proof Pack
      </p>
    </div>
  );
}
