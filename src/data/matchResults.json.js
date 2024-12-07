import OpenAI from "openai";

class Summariser {
    constructor() {
      this.openai = new OpenAI();
      this.instructions = `You are going to help me analyse some fantasy premier league data for the competition I'm in and write a short sentence about it. 
      When commenting on the results, try to avoid simple descriptions and focus more on finding something interesting. Also, make sure to mention something about each user.
      There are 38 gameweeks but you'll get the gameweeks that have been completed. 
      Comment on the overall possibility of someone being able to win the league or slip into last place.
      It has to sit at the top of a dashbord so make it concise and to the point.
      points_acc is the cumulative points for each team and will tell you the standings in the league.
      Also, the loser has to pay $500 to the teams join bank account so make sure to mention that in the sentence if it's relevant.
      `;
    }

    async summarise(data) {
        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {"role": "system", "content": this.instructions},
                {"role": "user", "content": JSON.stringify(data)}
            ]
        });

        return completion.choices[0].message.content;
    }
}

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

    async run() {
      const details = await this.getDetails();
      const users = await this.getUsers(details);
      const matchResults = await this.getMatchResults(details, users);
      const matchResultsWithCumsum = await this.getCumulativeSum(matchResults);

      const sentence = await this.summariser.summarise(matchResultsWithCumsum);
        // const sentence = `As we analyze the Fantasy Premier League data from the completed gameweeks, 
        // it’s evident that while Jay initially surged to the top, his consistency has waned, leaving him vulnerable as Kerrod continues to climb in the standings. 
        // Mitchell's fluctuating performances keep his team in the mix, but he must find a way to capitalize on opportunities, 
        // whereas Ryan’s recent struggles put him in jeopardy of slipping into the last position if he doesn’t regain form 
        // quickly—highlighting that every point counts in this fiercely competitive league.`

      return {
          sentence: sentence,
          data: matchResultsWithCumsum
      };
    }

}

const summariser = new Summariser();
const api = new PremierLeagueAPI(summariser);
const output = await api.run()

process.stdout.write(JSON.stringify(output));