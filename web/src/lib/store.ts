import { useSyncExternalStore } from "react";
import type { Mission } from "./types";
import { SEED_MISSIONS } from "./mockData";

let state: Mission[] = [...SEED_MISSIONS];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const missionStore = {
  getAll(): Mission[] {
    return state;
  },
  getById(id: string): Mission | undefined {
    return state.find((m) => m.id === id || m.shortId === id);
  },
  add(m: Mission) {
    state = [m, ...state];
    emit();
  },
  update(id: string, patch: Partial<Mission>) {
    state = state.map((m) => (m.id === id ? { ...m, ...patch } : m));
    emit();
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

export function useMissions(): Mission[] {
  return useSyncExternalStore(
    (l) => missionStore.subscribe(l),
    () => missionStore.getAll(),
    () => missionStore.getAll(),
  );
}

export function useMission(id: string | undefined): Mission | undefined {
  const missions = useMissions();
  if (!id) return undefined;
  return missions.find((m) => m.id === id || m.shortId === id);
}
