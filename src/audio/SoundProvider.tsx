import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { FloorTone } from "../content/tower";

type SoundApi = {
  on: boolean;
  toggle: () => void;
  setProgress: (progress: number, tone: FloorTone) => void;
};

const SoundContext = createContext<SoundApi | null>(null);

class RoomTone {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private wind: GainNode | null = null;
  private room: GainNode | null = null;
  private water: GainNode | null = null;
  private tone: FloorTone = "wind";
  enabled = false;
  private reduced = false;

  constructor() {
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  setEnabled(next: boolean) {
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    this.enabled = next;
    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(next ? 0.9 : 0, now, 0.4);
    if (next) void ctx.resume();
  }

  setProgress(progress: number, tone: FloorTone) {
    if (!this.context || !this.wind || !this.room || !this.water) return;
    const now = this.context.currentTime;
    const height = 1 - Math.min(1, Math.max(0, progress));
    this.wind.gain.setTargetAtTime(0.02 + height * 0.07, now, 0.35);
    this.room.gain.setTargetAtTime(0.012 + progress * 0.04, now, 0.35);
    this.water.gain.setTargetAtTime(tone === "water" ? 0.05 : 0, now, 0.5);
    if (tone !== this.tone) {
      this.tone = tone;
      if (this.enabled && !this.reduced) this.chime();
    }
  }

  dispose() {
    void this.context?.close();
    this.context = null;
  }

  private ensure() {
    if (this.context) return this.context;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;

    this.wind = this.layer(ctx, buffer, master, "highpass", 900);
    this.room = this.layer(ctx, buffer, master, "bandpass", 420);
    this.water = this.layer(ctx, buffer, master, "bandpass", 1400);
    this.drone(ctx, master, 82, 0.03);
    this.drone(ctx, master, 123, 0.016);
    this.drone(ctx, master, 988, 0.004);
    this.context = ctx;
    this.master = master;
    return ctx;
  }

  private layer(
    ctx: AudioContext,
    buffer: AudioBuffer,
    master: GainNode,
    kind: BiquadFilterType,
    frequency: number,
  ) {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = kind;
    filter.frequency.value = frequency;
    filter.Q.value = 0.7;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    source.start();
    return gain;
  }

  private drone(ctx: AudioContext, master: GainNode, frequency: number, level: number) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = frequency;
    const gain = ctx.createGain();
    gain.gain.value = level;
    osc.connect(gain);
    gain.connect(master);
    osc.start();
  }

  private chime() {
    if (!this.context || !this.master) return;
    const now = this.context.currentTime;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = "sine";
    osc.frequency.value = 1318;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.03, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(now);
    osc.stop(now + 0.75);
  }
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);
  const engine = useRef<RoomTone | null>(null);

  const api = useMemo<SoundApi>(
    () => ({
      on,
      toggle: () => {
        if (!engine.current) engine.current = new RoomTone();
        const next = !engine.current.enabled;
        engine.current.setEnabled(next);
        setOn(next);
      },
      setProgress: (progress, tone) => engine.current?.setProgress(progress, tone),
    }),
    [on],
  );

  useEffect(
    () => () => {
      engine.current?.dispose();
      engine.current = null;
    },
    [],
  );

  return <SoundContext.Provider value={api}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const value = useContext(SoundContext);
  if (!value) throw new Error("O som precisa ficar dentro do provedor.");
  return value;
}
