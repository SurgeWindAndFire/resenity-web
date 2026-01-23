function FeatureCard({ title, description }) {
  return (
    <article className="card" role="listitem">
      <header className="card-header">
        <h3>{title}</h3>
      </header>
      <p className="muted">{description}</p>
    </article>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="section" aria-label="Features">
      <div className="container">
        <header className="section-header">
          <h2>What data does Resenity provide?</h2>
          <p className="muted">Everything you need to determine the outcome of a match.</p>
        </header>

        <div className="grid-3" role="list">
          <FeatureCard title="Win Probability" description="Quick predictions you can rely on." />
          <FeatureCard title="Probability Reasoning" description="Know the exact reasoning for the outcome of your game." />
          <FeatureCard title="History & Progress" description="Save predictions to learn what to do in future matches." />
        </div>
      </div>
    </section>
  );
}
