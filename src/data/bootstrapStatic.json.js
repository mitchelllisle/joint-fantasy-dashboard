
import {PremierLeagueAPI} from "./premierLeagueAPI.js";

const api = new PremierLeagueAPI();

async function run(premierLeagueAPI) {
    const players = await premierLeagueAPI.getPlayers();
    const users = await premierLeagueAPI.getUsers();
    const allPicks = (await Promise.all(users.map(user => premierLeagueAPI.getPicks(user, players, 14)))).flat();
    const playersWithOwners = await premierLeagueAPI.attachOwners(players, allPicks)
    return {"data": playersWithOwners}
}

const playersWithOwners = await run(api);
process.stdout.write(JSON.stringify(playersWithOwners));
