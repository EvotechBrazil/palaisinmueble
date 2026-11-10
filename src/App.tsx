import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { floorAt, floors } from "./content/tower";
import { useSound } from "./audio/SoundProvider";
import { SoundProvider } from "./audio/SoundProvider";
import { Descent } from "./components/Descent";
import { LocationBand } from "./components/LocationBand";
import { RequestForm } from "./components/RequestForm";
import { SiteHeader } from "./components/SiteHeader";
import { SmoothScroll, useLenis } from "./shell/SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

export function App() {
  return (
    <SmoothScroll>
      <SoundProvider>
        <Film />
      </SoundProvider>
    </SmoothScroll>
  );
}

function Film() {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const pending = useRef(0);
  const floorId = useRef(floors[0].id);
  const lenis = useLenis();
  const sound = useSound();
  const [reduced, setReduced] = useState(false);
  const [progress, setProgress] = useState(0);
  const [floor, setFloor] = useState(floors[0]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useLayoutEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.7,
        onUpdate: (self) => {
          pending.current = self.progress;
          if (frame.current) return;
          frame.current = window.requestAnimationFrame(() => {
            frame.current = 0;
            const value = pending.current;
            const next = floorAt(value);
            setProgress(value);
            sound.setProgress(value, next.tone);
            if (next.id !== floorId.current) {
              floorId.current = next.id;
              setFloor(next);
            }
          });
        },
      });
    }, track);

    return () => {
      if (frame.current) window.cancelAnimationFrame(frame.current);
      ctx.revert();
    };
  }, [reduced, sound]);

  function onSeek(target: number) {
    const track = trackRef.current;
    if (!track) return;
    const top = track.offsetTop + target * Math.max(0, track.offsetHeight - window.innerHeight);
    if (lenis && !reduced) lenis.scrollTo(top);
    else window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <>
      <SiteHeader />
      <main>
        <section className="descent-track" ref={trackRef}>
          <Descent
            progress={progress}
            floor={floor}
            floors={floors}
            reduced={reduced}
            onSeek={onSeek}
            stageRef={stageRef}
          />
        </section>
        <LocationBand />
        <div id="pedido">
          <RequestForm />
        </div>
        <p className="colophon">
          Estudo de apresentação. As imagens trocam quando o desenho final chegar.
        </p>
      </main>
    </>
  );
}
