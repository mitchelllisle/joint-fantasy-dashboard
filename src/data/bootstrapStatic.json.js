
import {PremierLeagueAPI} from "./premierLeagueAPI.js";
import {Summariser} from "./summariser.js";

const summariser = new Summariser();
const api = new PremierLeagueAPI();

async function run(premierLeagueAPI) {
    const players = await premierLeagueAPI.getPlayers();
    const users = await premierLeagueAPI.getUsers();
    const currentGameweek = await premierLeagueAPI.getCurrentGameweek();

    const allPicks = (await Promise.all(users.map(user => premierLeagueAPI.getPicks(user, players, currentGameweek)))).flat();
    const playersWithOwners = await premierLeagueAPI.attachOwners(players, allPicks)

    // const summary = await summariser.chat(
    //     `Give me a paragraph of analysis about the teams and where they sit. No more than 20 words`,
    //     playersWithOwners.slice(0, 10),
    // );
    return {"data": playersWithOwners};
}

const playersWithOwners = await run(api);
process.stdout.write(JSON.stringify(playersWithOwners));
