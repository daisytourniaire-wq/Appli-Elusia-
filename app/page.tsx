import Link from "next/link";

const PILLARS = [
  {
    title: "Ton alimentation",
    text: "Sucre, antioxydants, bonnes graisses : ce que tu manges façonne l'environnement de ta peau.",
  },
  {
    title: "Ton mode de vie",
    text: "Sommeil, stress, activité physique : des piliers aussi puissants que ta routine skincare.",
  },
  {
    title: "Un profil sur-mesure",
    text: "3 axes prioritaires et 3 actions concrètes, personnalisés selon tes réponses.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-elusia-bg">
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-16 pt-20 text-center sm:pt-28">
        <span className="mb-6 rounded-full border border-elusia-line bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-elusia-clay">
          Élusia · Food Skincare
        </span>
        <h1 className="font-serif text-4xl italic leading-tight text-elusia-ink sm:text-5xl">
          La beauté commence aussi
          <br className="hidden sm:block" /> dans ton assiette.
        </h1>
        <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-elusia-muted sm:text-lg">
          En 3 minutes, découvre le lien entre tes habitudes alimentaires, ton
          mode de vie et l&apos;état de ta peau — et reçois ton profil Élusia
          personnalisé, avec 3 priorités et 3 actions concrètes.
        </p>
        <div className="mt-10">
          <Link href="/quiz" className="btn-primary">
            Commencer mon diagnostic
          </Link>
        </div>
        <p className="mt-4 text-xs text-elusia-muted">
          Gratuit · 3 minutes · sans engagement
        </p>
      </section>

      <section className="mx-auto grid max-w-4xl gap-5 px-6 pb-24 sm:grid-cols-3">
        {PILLARS.map((p) => (
          <div key={p.title} className="card">
            <h3 className="font-serif text-lg text-elusia-ink">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-elusia-muted">
              {p.text}
            </p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 text-center">
        <p className="text-xs leading-relaxed text-elusia-muted">
          Ce quiz ne remplace pas un avis médical ou dermatologique. Il vise à
          identifier des pistes d&apos;amélioration liées à ton alimentation et ton
          mode de vie.
        </p>
      </section>
    </main>
  );
}
