function RoadmapItem({ title, description, status }) {
  return (
    <article className="card roadmap-card" role="listitem">
      <header className="card-header">
        <h3>{title}</h3>
        {status && <span className={`roadmap-status ${status}`}>{status}</span>}
      </header>
      <p className="muted">{description}</p>
    </article>
  );
}

export default function RoadmapTeaserSection() {
  return (
    <section className="section" aria-label="Coming next">
      <div className="container">
        <header className="section-header">
          <h2>What's Next for Resenity?</h2>
          <p className="muted">Our roadmap for upcoming features and improvements</p>
        </header>
        <div className="grid-3" role="list">
          <RoadmapItem 
            title="Standalone Desktop Application" 
            status="planned"
            description="Although not a huge priority right now, A downloadable Desktop App would give way to users
                        who plan to use our services in real-time in their games a better and easier alternative             
                        to get the results and accuracy they want without having to constantly switch tabs."
          />
          <RoadmapItem 
            title="Match History Integration" 
            status="planned"
            description="Automatically import your recent matches to track prediction accuracy over time. See patterns in your wins and losses with detailed analytics."
          />
          <RoadmapItem 
            title="Future Games Support" 
            status="future"
            description="Once we are content with our current goals of being a League of Legends platform, we will
                         consider expanding to other games that our users would gladly adore our services for."
          />
        </div>
      </div>
    </section>
  );
}