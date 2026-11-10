import { useEffect, useRef, type RefObject } from "react";
import { brand, type Floor } from "../content/tower";

type DescentProps = {
  progress: number;
  floor: Floor;
  floors: Floor[];
  reduced: boolean;
  onSeek: (progress: number) => void;
  stageRef: RefObject<HTMLElement | null>;
};

export function Descent({ progress, floor, floors, reduced, onSeek, stageRef }: DescentProps) {
  if (reduced) {
    return (
      <div className="stage stage-static" ref={stageRef}>
        <header className="opening opening-static">
          <h1>{brand.name}</h1>
          <p>{brand.place}</p>
        </header>
        <div className="stack">
          {floors.map((item) => (
            <Plate key={`${item.id}-${item.from}`} floor={item} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="stage stage-film"
      id="topo"
      ref={stageRef}
      style={{ ["--p" as string]: String(progress) }}
    >
      <nav className="floor-nav" aria-label="Ambientes da torre">
        {floors
          .filter((item) => item.id !== "ponte")
          .map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={item.id === floor.id ? "true" : undefined}
              onClick={() => onSeek((item.from + item.to) / 2)}
            >
              {item.name}
            </button>
          ))}
      </nav>
      <div className="shaft">
        <FilmStack progress={progress} floors={floors} />
      </div>
      <p className="visually-hidden" aria-live="polite">
        {floor.name}
      </p>
      <div className="meter" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}

function layerAlpha(progress: number, item: Floor, index: number, total: number) {
  const fade = 0.04;
  const fadeInStart = index === 0 ? -1 : item.from - fade;
  const fadeInEnd = index === 0 ? item.from : item.from + fade;
  const fadeOutStart = item.to - fade;
  const fadeOutEnd = index === total - 1 ? item.to : item.to + fade;
  if (progress <= fadeInStart || progress >= fadeOutEnd) return 0;
  if (progress < fadeInEnd) return (progress - fadeInStart) / Math.max(0.001, fadeInEnd - fadeInStart);
  if (progress > fadeOutStart) return (fadeOutEnd - progress) / Math.max(0.001, fadeOutEnd - fadeOutStart);
  return 1;
}

function isBuffered(video: HTMLVideoElement, time: number) {
  const ranges = video.buffered;
  for (let index = 0; index < ranges.length; index += 1) {
    if (time >= ranges.start(index) - 0.05 && time <= ranges.end(index) + 0.2) return true;
  }
  return false;
}

function FilmStack({ progress, floors }: { progress: number; floors: Floor[] }) {
  const refs = useRef<Record<string, HTMLVideoElement | null>>({});
  const found = floors.findIndex((item) => progress >= item.from && progress < item.to);
  const current = found === -1 ? floors.length - 1 : found;

  useEffect(() => {
    floors.forEach((item, index) => {
      if (!item.video) return;
      const video = refs.current[item.video];
      if (!video || layerAlpha(progress, item, index, floors.length) <= 0.01) return;
      const span = Math.max(0.001, item.to - item.from);
      const local = Math.min(1, Math.max(0, (progress - item.from) / span));
      const seek = () => {
        if (!Number.isFinite(video.duration) || video.duration <= 0) return;
        const next = Math.min(video.duration - 0.04, Math.max(0, local * video.duration));
        if (!isBuffered(video, next)) return;
        if (Math.abs(video.currentTime - next) > 0.03) video.currentTime = next;
      };
      if (video.readyState >= 2) seek();
      else video.addEventListener("loadeddata", seek, { once: true });
    });
  }, [floors, progress]);

  return (
    <>
      {floors.map((item, index) =>
        item.video ? (
          <video
            key={item.video}
            ref={(node) => {
              refs.current[item.video as string] = node;
            }}
            className="facade film-layer"
            src={item.video}
            muted
            playsInline
            preload={index === current || index === current + 1 ? "auto" : "none"}
            poster={item.image}
            style={{ opacity: layerAlpha(progress, item, index, floors.length) }}
          />
        ) : null,
      )}
    </>
  );
}

function Plate({
  floor,
  live = false,
  hideFigure = false,
}: {
  floor: Floor;
  live?: boolean;
  hideFigure?: boolean;
}) {
  return (
    <article className="plate" aria-live={live ? "polite" : undefined}>
      <h2>{floor.name}</h2>
      <p>{floor.text}</p>
      {hideFigure ? null : (
        <figure>
          <img src={floor.image} alt={floor.imageAlt} />
          {floor.study ? <figcaption>Estudo de apresentação</figcaption> : null}
        </figure>
      )}
    </article>
  );
}
