import useFadeIn from "../../hooks/useFadeIn";

export default function FadeIn({ children, className = "", delay = 0 }) {
  const [ref, isVisible] = useFadeIn(0.1);

  return (
    <div
      ref={ref}
      className={`fade-in ${isVisible ? "visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}