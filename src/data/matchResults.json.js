// Fetch JSON from the Premier League API.
const response = await fetch("https://draft.premierleague.com/api/league/8999/details");
if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
const data = await response.json();

const users = data.league_entries.map((e) => ({
  id: e.id,
  name: e.entry_name,
  first_name: e.player_first_name,
}));

const matchResults = data.matches.filter((d) => d.finished).flatMap((e) => {
  const team1 = users.find(u => u.id === e.league_entry_1).first_name;
  const team2 = users.find(u => u.id === e.league_entry_2).first_name;
  const team1_points = e.league_entry_1_points;
  const team2_points = e.league_entry_2_points;
  let team1_result_points = 0;
  let team2_result_points = 0;

  if (team1_points > team2_points) {
    team1_result_points = 3;
  } else if (team1_points < team2_points) {
    team2_result_points = 3;
  } else {
    team1_result_points = 1;
    team2_result_points = 1;
  }

  return [
    {
      id: e.id,
      gameweek: e.event,
      finished: e.finished,
      team: team1,
      total_points: team1_points,
      points: team1_result_points
    },
    {
      id: e.id,
      gameweek: e.event,
      finished: e.finished,
      team: team2,
      total_points: team2_points,
      points: team2_result_points
    }
  ];
});

// Calculate cumulative sum for each team
const teamPoints = {};
const matchResultsWithCumsum = matchResults.map((match) => {
  if (!teamPoints[match.team]) {
    teamPoints[match.team] = 0;
  }
  teamPoints[match.team] += match.points;
  return {
    ...match,
    points_acc: teamPoints[match.team]
  };
});

process.stdout.write(JSON.stringify(matchResultsWithCumsum));