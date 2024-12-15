import {Summariser} from "./summariser.js";
import {PremierLeagueAPI} from "./premierLeagueAPI.js";

const summariser = new Summariser();
const api = new PremierLeagueAPI();

async function run(premierLeagueAPI, summariser) {
  const details = await premierLeagueAPI.getDetails();
  const users = await premierLeagueAPI.getUsers();
  const matchResults = await premierLeagueAPI.getMatchResults(details, users);
  const matchResultsWithCumsum = await premierLeagueAPI.getCumulativeSum(matchResults);
  const matchResultsWithCumsumRankings = await premierLeagueAPI.getRankingsForGameweeks(matchResultsWithCumsum);

  const title = await summariser.chat(
      `Give me a title for this data. Decide who the most relevant person to focus on in the title.
      Focus on the most recent gameweek and alternate between all the users. Don't give me stats or numbers, give me
      the type of title you'd see on a 1950s old timey newspaper. No more than 8 words`,
      matchResultsWithCumsumRankings
  );

  const sentence = await summariser.summarise(matchResultsWithCumsum);

  // const title = `Sample title`;
  // const sentence = `Sample sentence`;

  return {
      title: title,
      sentence: sentence,
      data: matchResultsWithCumsumRankings
  };
}

const output = await run(api, summariser)

process.stdout.write(JSON.stringify(output));
