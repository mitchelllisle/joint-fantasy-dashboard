import {Summariser} from "./summariser.js";
import _ from "lodash"

class PremierLeagueAPI {
    constructor(summariser) {
      this.summariser = summariser;
      this.url = "https://draft.premierleague.com/api/league/8999/details";
    }

    async getDetails() {
        const response = await fetch(this.url);
        if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
        return response.json();
    }

    async getUsers(details) {
        return details.league_entries.map((e) => ({
            id: e.id,
            name: e.entry_name,
            first_name: e.player_first_name,
        }));
    }

    async getMatchResults(details, users) {
        return details.matches.filter((d) => d.finished).flatMap((e) => {
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
    }

    async getCumulativeSum(matchResults) {
        const teamPoints = {};
        return matchResults.map((match) => {
            if (!teamPoints[match.team]) {
                teamPoints[match.team] = 0;
            }
            teamPoints[match.team] += match.points;
            return {
                ...match,
                points_acc: teamPoints[match.team]
            };
        });
    }

    async getRankingsForGameweeks(matchResults) {
        const gameweeks = matchResults.map((m) => m.gameweek).filter((value, index, self) => self.indexOf(value) === index);
        const rankings = gameweeks.flatMap((g) => {
            const gameweekResults = matchResults.filter((m) => m.gameweek === g);
            return _.sortBy(gameweekResults, (m) => m.points_acc)
                .reverse()
                .map((item, index) => ({
                    ...item,
                    rank: index + 1
                }));
        });

        return rankings;
    }

    async run() {
      const details = await this.getDetails();
      const users = await this.getUsers(details);
      const matchResults = await this.getMatchResults(details, users);
      const matchResultsWithCumsum = await this.getCumulativeSum(matchResults);
      const matchResultsWithCumsumRankings = await this.getRankingsForGameweeks(matchResultsWithCumsum);

      const title = await this.summariser.chat("Give me a snappy title for this data. No more than 10 words", matchResultsWithCumsumRankings);
      const sentence = await this.summariser.summarise(matchResultsWithCumsum);

      // const title = `Sample title`;
      // const sentence = `Sample sentence`;

      return {
          title: title,
          sentence: sentence,
          data: matchResultsWithCumsumRankings
      };
    }

}

const summariser = new Summariser();
const api = new PremierLeagueAPI(summariser);
const output = await api.run()

process.stdout.write(JSON.stringify(output));