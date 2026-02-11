export default function FeaturesSection() {
  const features = [
    {
      title: "Live Game Detection",
      description: "Enter your player ID, and we'll automatically search your live game and analyze everyone in the match as well."
    },
    {
      title: "Real Player Data",
      description: "Our service uses Riot's official API, so all of your results are real player data, not estimates."
    },
    {
      title: "Smart Predictions",
      description: "Our algorithm factors in team composition, rank distribution, and win rates to accurately predict the outcomes."
    },
    {
      title: "Save & Track",
      description: "Save your predictions to build your history. Use this to see how many of your matches turned out exactly like you predicted."
    }
  ];

  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-header">
          <h2>Why Use Resenity?</h2>
          <p className="muted">
            Everything that you might possibly need to make wiser decisions in champion select
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}