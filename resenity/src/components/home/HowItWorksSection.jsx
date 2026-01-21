function Step({ number, title, description }) {
  return (
    <li className="step">
      <div className="step-num" aria-hidden="true">
        {number}
      </div>
      <div className="step-body">
        <h3>{title}</h3>
        <p className="muted">{description}</p>
      </div>
    </li>
  );
}

export default function HowItWorksSection() {
  return (
    <section id="how" className="section" aria-label="How it works">
      <div className="container">
        {/* Header is its own block */}
        <header className="section-header how-head">
          <h2>How Our Service Works</h2>
          <p className="muted">
            Only three simple steps to fully utilize our service!
          </p>
        </header>

        {/* Steps + Example share the same row height */}
        <div className="how-body">
          <ol className="steps" aria-label="Steps">
            <Step
              number="1"
              title="Create a Match"
              description="Add any number of players or choose from one of our ready-made presets."
            />
            <Step
              number="2"
              title="Print out the Odds"
              description="Our service generates a report containing the prediction and confidence level."
            />
            <Step
              number="3"
              title="Understand the Why"
              description="A detailed explanation of the key factors contributing to the prediction will also be made."
            />
          </ol>

          <div className="card how-example-card">
            <header className="card-header">
              <h3>Example</h3>
            </header>
              <div className="flow" role="img" aria-label="Flow diagram">
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  height: '100%',
                  opacity: 0.6
                }}>
              <div style={{fontSize: '14px', color: 'rgba(232,238,252,0.7)'}}>Players Input</div>
              <div style={{fontSize: '24px'}}>↓</div>
              <div style={{fontSize: '14px', color: 'rgba(125,211,252,0.9)'}}>Analysis</div>
              <div style={{fontSize: '24px'}}>↓</div>
              <div style={{fontSize: '14px', color: 'rgba(232,238,252,0.7)'}}>Prediction Output</div>
          </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
