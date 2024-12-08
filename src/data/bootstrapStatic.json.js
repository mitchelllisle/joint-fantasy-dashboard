class PlayerData {
  constructor() {

  }

  async getUsers() {
      const response = await fetch("https://draft.premierleague.com/api/league/8999/details");
      if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
      const data = await response.json();
      return data.league_entries;
  }

  async getPlayers() {
      const response = await fetch("https://draft.premierleague.com/api/bootstrap-static");
      if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
      const data = await response.json();

      return data.elements.map((e) => ({
          id: e.id,
          name: e.web_name,
          team: e.team,
          minutes: e.minutes,
          total_points: e.total_points,
          owner: null
      }));
  }

  async getPicks(user, players, gameweek) {
      const response = await fetch(`https://draft.premierleague.com/api/entry/${user.entry_id}/event/${gameweek}`);
      if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
      const data = await response.json();

      return data.picks.map((p) => ({...p, user: user.player_first_name}));
  }

  async attachOwners(players, picks) {
      picks.forEach((p) => {
          const player = players.find((pl) => pl.id === p.element);
          if (player) {
              player.owner = p.user;
          }
      });
      return players
  }
}

const playerData = new PlayerData();
const players = await playerData.getPlayers();
const users = await playerData.getUsers();

const allPicks = (await Promise.all(users.map(user => playerData.getPicks(user, players, 14)))).flat();
const playersWithOwners = await playerData.attachOwners(players, allPicks);

process.stdout.write(JSON.stringify(playersWithOwners));
