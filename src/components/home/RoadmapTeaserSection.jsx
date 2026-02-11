function RoadmapItem({ title, description }) {
  return (
    <article className="card" role="listitem">
      <header className="card-header">
        <h3>{title}</h3>
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
          <h2>Coming Soon</h2>
          <p className="muted">What features do we currently have planned for the future of our service?</p>
        </header>

        <div className="grid-3" role="list">
          <RoadmapItem title="Standalone Desktop Application" description="
            Although not a huge priority right now, A downloadable Desktop App would give way to users
            who plan to use our services in real-time in their games a better and easier alternative
            to get the results and accuracy they want without having to constantly switch tabs." />
          <RoadmapItem title="Suggestions Page" 
            description="Constructive community feedback is always welcomed when it comes to trying to understand
            what our users really want. To achieve this goal, a dedicated page with potential 'forum-like' features
            would be an ideal solution to stregthen the gap between the developer-user relationship." />
          <RoadmapItem title="Future Games Support" 
            description="Once we are content with our current goals of being a League of Legends platform, we will
            consider expanding to other games that our users would gladly adore our services for." />
        </div>
      </div>
    </section>
  );
}
