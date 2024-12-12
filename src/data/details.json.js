import {PremierLeagueAPI} from "./premierLeagueAPI.js";

const api = new PremierLeagueAPI();

async function run(premierLeagueAPI) {
  const details = await premierLeagueAPI.getDetails();
  const users = await premierLeagueAPI.getUsers();
  return await premierLeagueAPI.getStandings(details, users);
}

const standings = await run(api);

process.stdout.write(JSON.stringify(standings));
