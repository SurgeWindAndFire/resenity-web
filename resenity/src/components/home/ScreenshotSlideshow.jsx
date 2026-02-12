import { useState, useEffect } from "react";
import "./ScreenshotSlideshow.css";

const slides = [
  {
    id: 1,
    image: "/ss1.png",
    title: "Live Game Detection",
    description: "Enter your Riot ID and instantly analyze all 10 players in your current match."
  },
  {
    id: 2,
    image: "/ss2.png",
    title: "Accurate Predictions",
    description: "Get win probabilities based on real ranks, win rates, and player performance."
  },
  {
    id: 3,
    image: "/ss3.png",
    title: "Manual Match Entry",
    description: "Analyze any hypothetical matchup by entering player details manually."
  },
  {
    id: 4,
    image: "/ss4.png",
    title: "Track Your Predictions",
    description: "Save predictions and build your history to see how accurate you are."
  }
];

export default function ScreenshotSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div 
      className="slideshow"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="slideshow-container">
        <button className="slideshow-arrow prev" onClick={prevSlide} aria-label="Previous slide">
          ‹
        </button>

        <div className="slideshow-content">
          <div className="slideshow-image-wrapper">
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="slideshow-image"
            />
          </div>
          
          <div className="slideshow-info">
            <h3>{slides[currentSlide].title}</h3>
            <p>{slides[currentSlide].description}</p>
          </div>
        </div>

        <button className="slideshow-arrow next" onClick={nextSlide} aria-label="Next slide">
          ›
        </button>
      </div>

      <div className="slideshow-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`slideshow-dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}