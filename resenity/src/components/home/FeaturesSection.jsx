export default function FeaturesSection() {
  const features = [
    {
      icon: "🎮",
      title: "Live Game Detection",
      description: "Enter your Riot ID and we'll automatically find your current game and analyze all 10 players instantly."
    },
    {
      icon: "📊",
      title: "Real Player Data",
      description: "Powered by Riot's official API. Get actual ranks, win rates, and match history — not estimates."
    },
    {
      icon: "🧠",
      title: "Smart Predictions",
      description: "Our algorithm analyzes team composition, rank distribution, and win rates to predict match outcomes."
    },
    {
      icon: "💾",
      title: "Save & Track",
      description: "Save your predictions and build a history. See how your matches turn out over time."
    }
  ];

  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-header">
          <h2>Why Use Resenity?</h2>
          <p className="muted">
            Everything you need to make smarter decisions in champion select
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