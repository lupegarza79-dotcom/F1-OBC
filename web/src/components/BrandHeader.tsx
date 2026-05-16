import { Link, useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5 group", className)}>
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm overflow-hidden">
        <span className="absolute inset-0 brand-hero opacity-100" />
        <svg viewBox="0 0 24 24" className="relative h-5 w-5 text-[hsl(var(--accent))]" fill="none">
          <path d="M3 13l7-1 3-8 2 7 6 1-6 2-2 7-3-7-7-1z" fill="currentColor" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-tight text-foreground">
          F1 <span className="text-muted-foreground/80 font-medium">OnBoard</span>
        </span>
        <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Solutions
        </span>
      </span>
    </Link>
  );
}

const NAV = [
  { to: "/shipper", label: "Ship" },
  { to: "/courier", label: "Become a Courier" },
  { to: "/receiver/F1-7421", label: "Receive" },
  { to: "/ops", label: "Operations" },
];

export function BrandHeader() {
  const loc = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <BrandMark />
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active = loc.pathname.startsWith(item.to.split("/").slice(0, 2).join("/")) && item.to !== "/";
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-secondary-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
            REAiL Verified
          </span>
        </div>
      </div>
    </header>
  );
}
