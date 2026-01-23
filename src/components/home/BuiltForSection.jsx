function AudienceCard({ title, description }) {
  return (
    <article className="card" role="listitem">
      <header className="card-header">
        <h3>{title}</h3>
      </header>
      <p className="muted">{description}</p>
    </article>
  );
}

export default function BuiltForSection() {
  return (
    <section className="section" aria-label="Built for">
      <div className="container">
        <header className="section-header">
          <h2>Our Service is Catered Towards Many Audiences</h2>
        </header>

        <div className="grid-4" role="list">
          <AudienceCard title="Ranked Climbers" 
            description="Never guess again before you queue up. Get instant predictions for your
            next match along with clear explanations on why your team is favored or in conflict.
            Play with confidence, not with doubt." />
          <AudienceCard title="Casual Climbers" 
            description="Don't have all the time to solo queue consistently? Our service helps you break
            down your matchups into simple, digestible insights. All of our provided tools are ensured
            to help your climb be as easy as possible without turning your games into a chore." />
          <AudienceCard title="Organized Teams" 
            description="Whether you're in a competitive team or just playing seriously with friends,
            our service will provide the tools to help you get a clearer insight on your opponents and their
            matchups, so you can help your team make the right decisions and play with confidence." />
          <AudienceCard title="Coaches & Analysts" 
            description="Stop getting lost in data. With Resenity,
            we provide clear, explainable breakdowns so you can guide and inform your players and make
            more informed decisions to help your team succeed." />
        </div>
      </div>
    </section>
  );
}
