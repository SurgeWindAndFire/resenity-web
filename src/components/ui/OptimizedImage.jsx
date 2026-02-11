import { useState } from "react";

export default function OptimizedImage({ 
  src, 
  alt, 
  className = "", 
  width, 
  height,
  lazy = true 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`optimized-image-wrapper ${className}`}>
      {!isLoaded && !hasError && (
        <div className="image-placeholder" style={{ width, height }} />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={lazy ? "lazy" : "eager"}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`optimized-image ${isLoaded ? "loaded" : ""}`}
      />
    </div>
  );
}