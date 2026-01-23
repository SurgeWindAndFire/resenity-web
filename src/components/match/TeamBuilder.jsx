import PlayerInput from "./PlayerInput";

export default function TeamBuilder({ team, setTeam, teamName, teamColor }) {
  const updatePlayer = (index, field, value) => {
    const newTeam = [...team];
    newTeam[index] = { ...newTeam[index], [field]: value };
    setTeam(newTeam);
  };

  return (
    <div className={`team-builder team-${teamColor}`}>
      <header className="team-header">
        <h2>{teamName}</h2>
        <span className={`team-indicator ${teamColor}`}></span>
      </header>
      
      <div className="players-list">
        {team.map((player, index) => (
          <PlayerInput
            key={index}
            player={player}
            index={index}
            onUpdate={(field, value) => updatePlayer(index, field, value)}
            teamColor={teamColor}
          />
        ))}
      </div>
    </div>
  );
}
