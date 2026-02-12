import { useState } from 'react';
import { lookupSummoner, normalizeRank } from '../../services/riotService';
import ChampionSelect from './ChampionSelect';
import { getChampionPrimaryRole } from '../../data/champions';

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

const ROLES = [
  { value: "top", label: "Top" },
  { value: "jungle", label: "JG" },
  { value: "mid", label: "Mid" },
  { value: "adc", label: "ADC" },
  { value: "support", label: "Sup" }
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

    const parts = name.split('#');
    if (parts.length !== 2) {
      setLookupError('Use format: Name#TAG');
      return;
    }

    const [gameName, tagLine] = parts;
    
    setIsLooking(true);
    setLookupError('');

    const result = await lookupSummoner(gameName, tagLine);
    
    setIsLooking(false);

    if (result.success) {
      const newRank = normalizeRank(result.player.rank);
      const newWinRate = result.player.winRate;
      
      onUpdate('rank', newRank);
      setTimeout(() => {
        onUpdate('winRate', newWinRate);
      }, 10);
      
      setLookupError('');
    } else {
      setLookupError(result.error || 'Player not found');
    }
  };

  const handleChampionChange = (championName) => {
    onUpdate('champion', championName);
    
    if (championName) {
      const primaryRole = getChampionPrimaryRole(championName);
      if (primaryRole) {
        onUpdate('role', primaryRole);
      }
    }
  };

  const defaultRole = ROLES[index]?.value || "top";
  const currentRole = player.role || defaultRole;

  return (
    <div className={`player-input player-${teamColor}`}>
      <div className="player-number">
        <span>{index + 1}</span>
      </div>
      
      <div className="player-fields">
        <div className="player-role-row">
          <div className="field field-role">
            <label>Role</label>
            <div className="role-selector">
              {ROLES.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  className={`role-btn ${currentRole === role.value ? 'active' : ''}`}
                  onClick={() => onUpdate("role", role.value)}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field field-champion">
            <label>Champion</label>
            <ChampionSelect
              value={player.champion}
              onChange={handleChampionChange}
              placeholder="Search champion..."
            />
          </div>
        </div>

        <div className="player-stats-row">
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
                className="btn-lookup"
                onClick={handleLookup}
                disabled={isLooking}
                title="Lookup player stats"
              >
                {isLooking ? <span className="btn-spinner"></span> : '🔍'}
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
            <label htmlFor={`winrate-${teamColor}-${index}`}>Win %</label>
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
    </div>
  );
}