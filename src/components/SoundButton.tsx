import { useSound } from "../audio/SoundProvider";

export function SoundButton() {
  const sound = useSound();
  return (
    <button
      className="sound"
      type="button"
      aria-pressed={sound.on}
      onClick={sound.toggle}
    >
      {sound.on ? "Som ligado" : "Som"}
    </button>
  );
}
