import {PremierLeagueAPI} from "./premierLeagueAPI.js";

const api = new PremierLeagueAPI();

async function run(premierLeagueAPI) {
    const data = await premierLeagueAPI.getAllTeamStats();
    process.stdout.write(JSON.stringify(data));
}

await run(api)
