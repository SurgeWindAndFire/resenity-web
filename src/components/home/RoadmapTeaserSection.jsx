function RoadmapItem({ title }) {
  return (
    <article className="card" role="listitem">
      <header className="card-header">
        <h3>{title}</h3>
      </header>
      <p className="muted">Planned</p>
    </article>
  );
}

export default function RoadmapTeaserSection() {
  return (
    <section className="section" aria-label="Coming next">
      <div className="container">
        <header className="section-header">
          <h2>Coming Soon</h2>
          <p className="muted">Service to be expanded beyond League of Legends when we're ready.</p>
        </header>

        <div className="grid-3" role="list">
          <RoadmapItem title="Champion Draft Synergy" />
          <RoadmapItem title="Team Dashboards" />
          <RoadmapItem title="Future Games Support" />
        </div>
      </div>
    </section>
  );
}
