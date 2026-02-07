import "./Skeleton.css";

export function Skeleton({ width = "100%", height = "20px", borderRadius = "8px" }) {
  return (
    <div 
      className="skeleton" 
      style={{ width, height, borderRadius }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <Skeleton width="60%" height="24px" />
        <Skeleton width="80px" height="28px" borderRadius="20px" />
      </div>
      <div className="skeleton-body">
        <Skeleton width="100%" height="16px" />
        <Skeleton width="85%" height="16px" />
        <Skeleton width="70%" height="16px" />
      </div>
    </div>
  );
}

export function SkeletonPrediction() {
  return (
    <div className="skeleton-prediction">
      <div className="skeleton-teams">
        <div className="skeleton-team">
          <Skeleton width="100px" height="20px" />
          <Skeleton width="100%" height="40px" />
          <Skeleton width="100%" height="40px" />
          <Skeleton width="100%" height="40px" />
          <Skeleton width="100%" height="40px" />
          <Skeleton width="100%" height="40px" />
        </div>
        <div className="skeleton-team">
          <Skeleton width="100px" height="20px" />
          <Skeleton width="100%" height="40px" />
          <Skeleton width="100%" height="40px" />
          <Skeleton width="100%" height="40px" />
          <Skeleton width="100%" height="40px" />
          <Skeleton width="100%" height="40px" />
        </div>
      </div>
      <Skeleton width="100%" height="120px" borderRadius="12px" />
    </div>
  );
}