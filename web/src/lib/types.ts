export type MissionStatus = "green" | "yellow" | "red" | "complete" | "delay";

export type TimelineStep = {
  id: string;
  label: string;
  detail?: string;
  status: "done" | "active" | "pending";
  time?: string;
};

export type PrecheckFlag = {
  label: string;
  level: "ok" | "warn" | "block";
  note?: string;
};

export type FlightOption = {
  id: "fastest" | "value" | "secure";
  title: string;
  carrier: string;
  flightNo: string;
  from: string;
  to: string;
  departLocal: string;
  arriveLocal: string;
  durationMin: number;
  stops: number;
  riskLabel: "Low" | "Medium" | "High";
  pickupEtaMin: number;
  deliveryEtaHours: number;
  price: number;
  recommended?: boolean;
};

export type Mission = {
  id: string;
  shortId: string;
  status: MissionStatus;
  createdAt: string;
  item: {
    type: string;
    name: string;
    weightKg?: number;
    sizeCm?: string;
    valueUsd?: number;
    notes?: string;
  };
  pickup: { address: string; contact: string; city: string; airport: string; window: string };
  delivery: { address: string; contact: string; city: string; airport: string; deadline: string };
  courier?: {
    name: string;
    initials: string;
    rating: number;
    trips: number;
    verified: boolean;
  };
  flight?: {
    number: string;
    carrier: string;
    from: string;
    to: string;
    departLocal: string;
    arriveLocal: string;
    status: "recommended" | "reserved" | "booked" | "delayed" | "boarded" | "in-air" | "landed";
  };
  price: {
    courier: number;
    flight: number;
    ground: number;
    compliance: number;
    insurance: number;
    platform: number;
    total: number;
  };
  precheck: {
    light: "green" | "yellow" | "red";
    flags: PrecheckFlag[];
  };
  timeline: TimelineStep[];
  proof: {
    sealed: boolean;
    items: { label: string; ok: boolean }[];
  };
  notes?: string;
};
