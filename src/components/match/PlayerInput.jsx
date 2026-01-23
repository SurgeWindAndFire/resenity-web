const RANKS = [
  "Iron",
  "Bronze", 
  "Silver",
  "Gold",
  "Platinum",
  "Emerald",
  "Diamond",
  "Master",
  "Grandmaster",
  "Challenger"
];

export default function PlayerInput({ player, index, onUpdate, teamColor }) {
  return (
    <div className={`player-input player-${teamColor}`}>
      <div className="player-number">
        <span>{index + 1}</span>
      </div>
      
      <div className="player-fields">
        <div className="field">
          <label htmlFor={`name-${teamColor}-${index}`}>Player Name</label>
          <input
            type="text"
            id={`name-${teamColor}-${index}`}
            value={player.name}
            onChange={(e) => onUpdate("name", e.target.value)}
            placeholder="Enter Summoner name"
          />
        </div>
        
        <div className="field field-small">
          <label htmlFor={`rank-${teamColor}-${index}`}>Rank</label>
          <select
            id={`rank-${teamColor}-${index}`}
            value={player.rank}
            onChange={(e) => onUpdate("rank", e.target.value)}
          >
            {RANKS.map(rank => (
              <option key={rank} value={rank}>{rank}</option>
            ))}
          </select>
        </div>
        
        <div className="field field-small">
          <label htmlFor={`winrate-${teamColor}-${index}`}>Win Rate %</label>
          <input
            type="number"
            id={`winrate-${teamColor}-${index}`}
            value={player.winRate}
            onChange={(e) => onUpdate("winRate", Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
            min="0"
            max="100"
          />
        </div>
      </div>
    </div>
  );
}