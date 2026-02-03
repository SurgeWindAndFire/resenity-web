import { useState } from 'react';
import { lookupSummoner, normalizeRank } from '../../services/riotService';

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
  const [isLooking, setIsLooking] = useState(false);
  const [lookupError, setLookupError] = useState('');

  const handleLookup = async () => {
    const name = player.name.trim();
    
    if (!name) {
      setLookupError('Enter a Riot ID first (e.g., Name#TAG)');
      return;
    }

    // Parse Riot ID (Name#TAG format)
    const parts = name.split('#');
    if (parts.length !== 2) {
      setLookupError('Use format: Name#TAG');
      return;
    }

    const [gameName, tagLine] = parts;
    
    setIsLooking(true);
    setLookupError('');

    const result = await lookupSummoner(gameName, tagLine);
    
    console.log('Lookup result:', result); // DEBUG: Let's see what we get

    setIsLooking(false);

    if (result.success) {
      console.log('Updating rank to:', normalizeRank(result.player.rank)); // DEBUG
      console.log('Updating winRate to:', result.player.winRate); // DEBUG
      
      onUpdate('rank', normalizeRank(result.player.rank));
      onUpdate('winRate', result.player.winRate);
      setLookupError('');
    } else {
      setLookupError(result.error || 'Player not found');
    }
  };

  return (
    <div className={`player-input player-${teamColor}`}>
      <div className="player-number">
        <span>{index + 1}</span>
      </div>
      
      <div className="player-fields">
        <div className="field field-name">
          <label htmlFor={`name-${teamColor}-${index}`}>Riot ID</label>
          <div className="input-with-button">
            <input
              type="text"
              id={`name-${teamColor}-${index}`}
              value={player.name}
              onChange={(e) => onUpdate("name", e.target.value)}
              placeholder="Name#TAG"
            />
            <button 
              type="button"
              className="btn btn-lookup"
              onClick={handleLookup}
              disabled={isLooking}
              title="Lookup player stats"
            >
              {isLooking ? '...' : '🔍'}
            </button>
          </div>
          {lookupError && <span className="lookup-error">{lookupError}</span>}
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