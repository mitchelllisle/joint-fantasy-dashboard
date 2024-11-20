// Fetch JSON from the Premier League API.
const response = await fetch("https://draft.premierleague.com/api/league/8999/details");
if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
const data = await response.json();

const users = data.league_entries.map((e) => ({
  id: e.id,
  name: e.entry_name,
  first_name: e.player_first_name,
}));

const standings = data.standings.map((e) => ({
  id: e.league_entry,
  name: users.find(u => u.id === e.league_entry).name,
  user: users.find(u => u.id === e.league_entry).first_name,
  rank: e.rank,
  total: e.total,
  points_for: e.points_for,
  points_against: e.points_against,
  matches_won: e.matches_won,
  matches_lost: e.matches_lost,
  matches_drawn: e.matches_drawn
}));

// Output CSV.
process.stdout.write(JSON.stringify(standings));