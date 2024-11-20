import * as d3 from "d3"

// Fetch JSON from the Premier League API.
const response = await fetch("https://draft.premierleague.com/api/bootstrap-static");
if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
const data = await response.json();


// Convert to an array of objects.
const elements = data.elements.map((e) => ({
  name: e.web_name,
  team: e.team,
  total_points: e.total_points
})).sort((a, b) => d3.descending(a.total_points, b.total_points)).slice(0, 10);

// Output CSV.
process.stdout.write(JSON.stringify(elements));