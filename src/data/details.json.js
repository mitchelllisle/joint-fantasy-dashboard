import {PremierLeagueAPI} from "./premierLeagueAPI.js";

const api = new PremierLeagueAPI();

async function run(premierLeagueAPI) {
  const details = await premierLeagueAPI.getDetails();
  return await premierLeagueAPI.getStandings(details);
}

const standings = await run(api);

process.stdout.write(JSON.stringify(standings));
