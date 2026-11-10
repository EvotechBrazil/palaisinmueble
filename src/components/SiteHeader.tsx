import { brand } from "../content/tower";
import { SoundButton } from "./SoundButton";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip" href="#pedido">
        Ir para o pedido
      </a>
      <a className="mark" href="#topo" aria-label={brand.name}>
        <img src={brand.logo} alt={brand.markAlt} />
      </a>
      <SoundButton />
    </header>
  );
}
