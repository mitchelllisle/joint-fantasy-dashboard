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
      `Give me one sentences that describe the results of the most recent gameweek that includes a high level analysis of
      the results. Every week there are two games that happen. Don't give me stats or numbers, just focus on the result.
      Something like 'player a beat player b in a close game' or 'player c dominated player d in a one sided match'. 
      Be more creative than that though. Keep it to 20 words or less. Don't include any * in the title. 
      Make it sound like a newspaper article`,
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
