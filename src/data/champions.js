// Champion data with role mappings
// Role priority: 1 = primary role, 2 = secondary role, 3 = tertiary/off-meta
// Last updated: Includes all champions through November 2025

export const CHAMPIONS = {
  // A
  "Aatrox": { id: 266, roles: { top: 1, mid: 3 } },
  "Ahri": { id: 103, roles: { mid: 1 } },
  "Akali": { id: 84, roles: { mid: 1, top: 2 } },
  "Akshan": { id: 166, roles: { mid: 1, top: 2, adc: 3 } },
  "Alistar": { id: 12, roles: { support: 1 } },
  "Ambessa": { id: 799, roles: { top: 1, jungle: 2 } },
  "Amumu": { id: 32, roles: { jungle: 1, support: 2 } },
  "Anivia": { id: 34, roles: { mid: 1 } },
  "Annie": { id: 1, roles: { mid: 1, support: 2 } },
  "Aphelios": { id: 523, roles: { adc: 1 } },
  "Ashe": { id: 22, roles: { adc: 1, support: 2 } },
  "Aurelion Sol": { id: 136, roles: { mid: 1 } },
  "Aurora": { id: 893, roles: { mid: 1, top: 2 } },
  "Azir": { id: 268, roles: { mid: 1 } },

  // B
  "Bard": { id: 432, roles: { support: 1 } },
  "Bel'Veth": { id: 200, roles: { jungle: 1 } },
  "Blitzcrank": { id: 53, roles: { support: 1 } },
  "Brand": { id: 63, roles: { support: 1, mid: 2, jungle: 3 } },
  "Braum": { id: 201, roles: { support: 1 } },
  "Briar": { id: 233, roles: { jungle: 1, top: 3 } },

  // C
  "Caitlyn": { id: 51, roles: { adc: 1, mid: 3 } },
  "Camille": { id: 164, roles: { top: 1, jungle: 3 } },
  "Cassiopeia": { id: 69, roles: { mid: 1, top: 2, adc: 3 } },
  "Cho'Gath": { id: 31, roles: { top: 1, mid: 2, jungle: 3 } },
  "Corki": { id: 42, roles: { mid: 1, adc: 2 } },

  // D
  "Darius": { id: 122, roles: { top: 1 } },
  "Diana": { id: 131, roles: { jungle: 1, mid: 2 } },
  "Dr. Mundo": { id: 36, roles: { top: 1, jungle: 2 } },
  "Draven": { id: 119, roles: { adc: 1 } },

  // E
  "Ekko": { id: 245, roles: { jungle: 1, mid: 2 } },
  "Elise": { id: 60, roles: { jungle: 1 } },
  "Evelynn": { id: 28, roles: { jungle: 1 } },
  "Ezreal": { id: 81, roles: { adc: 1, mid: 3 } },

  // F
  "Fiddlesticks": { id: 9, roles: { jungle: 1, support: 3 } },
  "Fiora": { id: 114, roles: { top: 1 } },
  "Fizz": { id: 105, roles: { mid: 1, top: 3 } },

  // G
  "Galio": { id: 3, roles: { mid: 1, support: 2 } },
  "Gangplank": { id: 41, roles: { top: 1, mid: 2 } },
  "Garen": { id: 86, roles: { top: 1, mid: 3 } },
  "Gnar": { id: 150, roles: { top: 1 } },
  "Gragas": { id: 79, roles: { jungle: 1, top: 2, mid: 3, support: 3 } },
  "Graves": { id: 104, roles: { jungle: 1, top: 3 } },
  "Gwen": { id: 887, roles: { top: 1, jungle: 3 } },

  // H
  "Hecarim": { id: 120, roles: { jungle: 1, top: 3 } },
  "Heimerdinger": { id: 74, roles: { mid: 1, top: 2, support: 2, adc: 3 } },
  "Hwei": { id: 910, roles: { mid: 1, support: 2 } },

  // I
  "Illaoi": { id: 420, roles: { top: 1 } },
  "Irelia": { id: 39, roles: { top: 1, mid: 2 } },
  "Ivern": { id: 427, roles: { jungle: 1, support: 3 } },

  // J
  "Janna": { id: 40, roles: { support: 1 } },
  "Jarvan IV": { id: 59, roles: { jungle: 1, top: 3 } },
  "Jax": { id: 24, roles: { top: 1, jungle: 2 } },
  "Jayce": { id: 126, roles: { top: 1, mid: 2 } },
  "Jhin": { id: 202, roles: { adc: 1 } },
  "Jinx": { id: 222, roles: { adc: 1 } },

  // K
  "K'Sante": { id: 897, roles: { top: 1 } },
  "Kai'Sa": { id: 145, roles: { adc: 1, mid: 3 } },
  "Kalista": { id: 429, roles: { adc: 1 } },
  "Karma": { id: 43, roles: { support: 1, mid: 2, top: 3 } },
  "Karthus": { id: 30, roles: { jungle: 1, mid: 2, adc: 3 } },
  "Kassadin": { id: 38, roles: { mid: 1 } },
  "Katarina": { id: 55, roles: { mid: 1 } },
  "Kayle": { id: 10, roles: { top: 1, mid: 2 } },
  "Kayn": { id: 141, roles: { jungle: 1 } },
  "Kennen": { id: 85, roles: { top: 1, mid: 3, adc: 3 } },
  "Kha'Zix": { id: 121, roles: { jungle: 1 } },
  "Kindred": { id: 203, roles: { jungle: 1, adc: 3 } },
  "Kled": { id: 240, roles: { top: 1 } },
  "Kog'Maw": { id: 96, roles: { adc: 1, mid: 3 } },

  // L
  "LeBlanc": { id: 7, roles: { mid: 1 } },
  "Lee Sin": { id: 64, roles: { jungle: 1, top: 3, mid: 3 } },
  "Leona": { id: 89, roles: { support: 1 } },
  "Lillia": { id: 876, roles: { jungle: 1, top: 2 } },
  "Lissandra": { id: 127, roles: { mid: 1 } },
  "Lucian": { id: 236, roles: { adc: 1, mid: 2, top: 3 } },
  "Lulu": { id: 117, roles: { support: 1, mid: 3 } },
  "Lux": { id: 99, roles: { support: 1, mid: 2 } },

  // M
  "Malphite": { id: 54, roles: { top: 1, support: 2, mid: 3 } },
  "Malzahar": { id: 90, roles: { mid: 1 } },
  "Maokai": { id: 57, roles: { support: 1, jungle: 2, top: 3 } },
  "Master Yi": { id: 11, roles: { jungle: 1 } },
  "Mel": { id: 950, roles: { mid: 1, support: 2 } },
  "Milio": { id: 902, roles: { support: 1 } },
  "Miss Fortune": { id: 21, roles: { adc: 1, support: 3 } },
  "Mordekaiser": { id: 82, roles: { top: 1, jungle: 3 } },
  "Morgana": { id: 25, roles: { support: 1, mid: 2, jungle: 3 } },

  // N
  "Naafiri": { id: 948, roles: { mid: 1, jungle: 2 } },
  "Nami": { id: 267, roles: { support: 1 } },
  "Nasus": { id: 75, roles: { top: 1 } },
  "Nautilus": { id: 111, roles: { support: 1, jungle: 3 } },
  "Neeko": { id: 518, roles: { mid: 1, support: 2, adc: 3, top: 3 } },
  "Nidalee": { id: 76, roles: { jungle: 1 } },
  "Nilah": { id: 895, roles: { adc: 1 } },
  "Nocturne": { id: 56, roles: { jungle: 1, mid: 3 } },
  "Nunu & Willump": { id: 20, roles: { jungle: 1 } },

  // O
  "Olaf": { id: 2, roles: { jungle: 1, top: 2 } },
  "Orianna": { id: 61, roles: { mid: 1 } },
  "Ornn": { id: 516, roles: { top: 1, support: 3 } },

  // P
  "Pantheon": { id: 80, roles: { support: 1, mid: 2, top: 2, jungle: 3 } },
  "Poppy": { id: 78, roles: { jungle: 1, top: 2, support: 2 } },
  "Pyke": { id: 555, roles: { support: 1, mid: 3 } },

  // Q
  "Qiyana": { id: 246, roles: { mid: 1, jungle: 3 } },
  "Quinn": { id: 133, roles: { top: 1, mid: 3 } },

  // R
  "Rakan": { id: 497, roles: { support: 1 } },
  "Rammus": { id: 33, roles: { jungle: 1 } },
  "Rek'Sai": { id: 421, roles: { jungle: 1 } },
  "Rell": { id: 526, roles: { support: 1 } },
  "Renata Glasc": { id: 888, roles: { support: 1 } },
  "Renekton": { id: 58, roles: { top: 1, mid: 3 } },
  "Rengar": { id: 107, roles: { jungle: 1, top: 2 } },
  "Riven": { id: 92, roles: { top: 1, mid: 3 } },
  "Rumble": { id: 68, roles: { top: 1, mid: 2, jungle: 3 } },
  "Ryze": { id: 13, roles: { mid: 1, top: 2 } },

  // S
  "Samira": { id: 360, roles: { adc: 1 } },
  "Sejuani": { id: 113, roles: { jungle: 1, top: 3 } },
  "Senna": { id: 235, roles: { support: 1, adc: 2 } },
  "Seraphine": { id: 147, roles: { support: 1, mid: 2, adc: 2 } },
  "Sett": { id: 875, roles: { top: 1, support: 2, jungle: 3 } },
  "Shaco": { id: 35, roles: { jungle: 1, support: 3 } },
  "Shen": { id: 98, roles: { top: 1, support: 2 } },
  "Shyvana": { id: 102, roles: { jungle: 1, top: 3 } },
  "Singed": { id: 27, roles: { top: 1, mid: 3 } },
  "Sion": { id: 14, roles: { top: 1, support: 2, mid: 3 } },
  "Sivir": { id: 15, roles: { adc: 1 } },
  "Skarner": { id: 72, roles: { jungle: 1, top: 3 } },
  "Smolder": { id: 901, roles: { adc: 1, mid: 3 } },
  "Sona": { id: 37, roles: { support: 1 } },
  "Soraka": { id: 16, roles: { support: 1, top: 3 } },
  "Swain": { id: 50, roles: { support: 1, mid: 2, adc: 2, top: 3 } },
  "Sylas": { id: 517, roles: { mid: 1, top: 2, jungle: 3 } },
  "Syndra": { id: 134, roles: { mid: 1 } },

  // T
  "Tahm Kench": { id: 223, roles: { support: 1, top: 2 } },
  "Taliyah": { id: 163, roles: { jungle: 1, mid: 2, support: 3 } },
  "Talon": { id: 91, roles: { mid: 1, jungle: 2 } },
  "Taric": { id: 44, roles: { support: 1 } },
  "Teemo": { id: 17, roles: { top: 1, support: 3 } },
  "Thresh": { id: 412, roles: { support: 1 } },
  "Tristana": { id: 18, roles: { adc: 1, mid: 2 } },
  "Trundle": { id: 48, roles: { jungle: 1, top: 2, support: 3 } },
  "Tryndamere": { id: 23, roles: { top: 1, mid: 3 } },
  "Twisted Fate": { id: 4, roles: { mid: 1, adc: 3 } },
  "Twitch": { id: 29, roles: { adc: 1, jungle: 3, support: 3 } },

  // U
  "Udyr": { id: 77, roles: { jungle: 1, top: 2 } },
  "Urgot": { id: 6, roles: { top: 1 } },

  // V
  "Varus": { id: 110, roles: { adc: 1, mid: 2 } },
  "Vayne": { id: 67, roles: { adc: 1, top: 2 } },
  "Veigar": { id: 45, roles: { mid: 1, adc: 2, support: 3 } },
  "Vel'Koz": { id: 161, roles: { mid: 1, support: 2 } },
  "Vex": { id: 711, roles: { mid: 1 } },
  "Vi": { id: 254, roles: { jungle: 1 } },
  "Viego": { id: 234, roles: { jungle: 1, top: 3, mid: 3 } },
  "Viktor": { id: 112, roles: { mid: 1 } },
  "Vladimir": { id: 8, roles: { mid: 1, top: 2 } },
  "Volibear": { id: 106, roles: { top: 1, jungle: 2 } },

  // W
  "Warwick": { id: 19, roles: { jungle: 1, top: 2 } },
  "Wukong": { id: 62, roles: { jungle: 1, top: 2, mid: 3 } },

  // X
  "Xayah": { id: 498, roles: { adc: 1 } },
  "Xerath": { id: 101, roles: { mid: 1, support: 2 } },
  "Xin Zhao": { id: 5, roles: { jungle: 1 } },

  // Y
  "Yasuo": { id: 157, roles: { mid: 1, top: 2, adc: 3 } },
  "Yone": { id: 777, roles: { mid: 1, top: 2 } },
  "Yorick": { id: 83, roles: { top: 1 } },
  "Yunara": { id: 949, roles: { adc: 1, mid: 3 } },
  "Yuumi": { id: 350, roles: { support: 1 } },

  // Z
  "Zaahen": { id: 951, roles: { top: 1, jungle: 2 } },
  "Zac": { id: 154, roles: { jungle: 1, top: 3, support: 3 } },
  "Zed": { id: 238, roles: { mid: 1, jungle: 3 } },
  "Zeri": { id: 221, roles: { adc: 1 } },
  "Ziggs": { id: 115, roles: { mid: 1, adc: 2, support: 3 } },
  "Zilean": { id: 26, roles: { support: 1, mid: 2 } },
  "Zoe": { id: 142, roles: { mid: 1 } },
  "Zyra": { id: 143, roles: { support: 1, mid: 3 } }
};

export const CHAMPION_ID_MAP = Object.fromEntries(
  Object.entries(CHAMPIONS).map(([name, data]) => [data.id, name])
);

export function getChampionById(id) {
  return CHAMPION_ID_MAP[id] || null;
}

export function getChampionPrimaryRole(championName) {
  const champion = CHAMPIONS[championName];
  if (!champion) return null;
  
  let primaryRole = null;
  let highestPriority = Infinity;
  
  for (const [role, priority] of Object.entries(champion.roles)) {
    if (priority < highestPriority) {
      highestPriority = priority;
      primaryRole = role;
    }
  }
  
  return primaryRole;
}

export function getChampionRoles(championName) {
  const champion = CHAMPIONS[championName];
  if (!champion) return [];
  
  return Object.entries(champion.roles)
    .sort((a, b) => a[1] - b[1])
    .map(([role, _]) => role);
}

export function canPlayRole(championName, role) {
  const champion = CHAMPIONS[championName];
  if (!champion) return false;
  return role in champion.roles;
}

export function getRolePriority(championName, role) {
  const champion = CHAMPIONS[championName];
  if (!champion || !(role in champion.roles)) return null;
  return champion.roles[role];
}

export function getChampionsForRole(role) {
  return Object.entries(CHAMPIONS)
    .filter(([_, data]) => role in data.roles)
    .sort((a, b) => a[1].roles[role] - b[1].roles[role])
    .map(([name, _]) => name);
}

export function getAllChampionNames() {
  return Object.keys(CHAMPIONS).sort();
}

export function searchChampions(query) {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return Object.keys(CHAMPIONS)
    .filter(name => name.toLowerCase().includes(lowerQuery))
    .sort();
}

export function inferRoleFromChampion(championName, teamContext = null) {
  const champion = CHAMPIONS[championName];
  if (!champion) return "mid";

  if (teamContext && Array.isArray(teamContext)) {
    const takenRoles = teamContext
      .filter(p => p.role && p.champion !== championName)
      .map(p => p.role);

    const sortedRoles = Object.entries(champion.roles)
      .sort((a, b) => a[1] - b[1])
      .map(([role, _]) => role);
    
    for (const role of sortedRoles) {
      if (!takenRoles.includes(role)) {
        return role;
      }
    }
  }

  return getChampionPrimaryRole(championName);
}

export function getChampionInfo(championName) {
  const champion = CHAMPIONS[championName];
  if (!champion) return null;
  
  return {
    name: championName,
    id: champion.id,
    primaryRole: getChampionPrimaryRole(championName),
    roles: getChampionRoles(championName),
    imageUrl: `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${championName.replace(/['\s]/g, '').replace('&', '')}.png`
  };
}

export const ROLE_INFO = {
  top: { label: "Top", icon: "🛡️", color: "#e8b923" },
  jungle: { label: "Jungle", icon: "🌲", color: "#2ecc71" },
  mid: { label: "Mid", icon: "⚡", color: "#9b59b6" },
  adc: { label: "ADC", icon: "🎯", color: "#e74c3c" },
  support: { label: "Support", icon: "💚", color: "#16ddb2" }
};