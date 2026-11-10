import { brand, places } from "../content/tower";

export function LocationBand() {
  return (
    <section className="location" aria-labelledby="localizacao">
      <h2 id="localizacao">Localização</h2>
      <img src={brand.map} alt={brand.mapAlt} />
      <div className="places">
        {places.map((place) => (
          <article key={place.name}>
            <h3>{place.name}</h3>
            <p>{place.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
