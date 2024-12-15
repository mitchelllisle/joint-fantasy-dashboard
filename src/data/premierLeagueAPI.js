import _ from "lodash"

const teamColours = [{
        id: 1,
        second_id: 1,
        name: "Arsenal",
        mainColor: "#e20712",
        secondaryColor: "#ffffff"
    },
    {
        id: 2,
        second_id: 2,
        name: "Aston Villa",
        mainColor: "#410e1e",
        secondaryColor: "#94c0e6"
    },
    {
        id: 3,
        second_id: 127,
        name: "Bournemouth",
        mainColor: "#c4090e",
        secondaryColor: "#000000"
    },
    {
        id: 4,
        second_id: 130,
        name: "Brentford",
        mainColor: "#bf0300",
        secondaryColor: "#ffba1c"
    },
    {
        id: 5,
        second_id: 131,
        name: "Brighton & Hove Albion",
        mainColor: "#0154a6",
        secondaryColor: "#ffffff"
    },
    {
        id: 11,
        second_id: 26,
        name: "Leicester City",
        mainColor: "#062d88",
        secondaryColor: "#faba00"
    },
    {
        id: 6,
        second_id: 4,
        name: "Chelsea",
        mainColor: "#001489",
        secondaryColor: "#ffffff"
    },
    {
        id: 7,
        second_id: 6,
        name: "Crystal Palace",
        mainColor: "#ee2b20",
        secondaryColor: "#0055a6"
    },
    {
        id: 8,
        second_id: 7,
        name: "Everton",
        mainColor: "#004593",
        secondaryColor: "#ffffff"
    },
    {
        id: 9,
        second_id: 34,
        name: "Fulham",
        mainColor: "#ffffff",
        secondaryColor: "#000000"
    },
    {
        id: 12,
        second_id: 10,
        name: "Liverpool",
        mainColor: "#e31921",
        secondaryColor: "#ffffff"
    },
    {
        id: 10,
        second_id: 8,
        name: "Ipswich Town",
        mainColor: "#0c3d91",
        secondaryColor: "#ffffff"
    },
    {
        id: 13,
        second_id: 11,
        name: "Manchester City",
        mainColor: "#7ab1e2",
        secondaryColor: "#ffffff"
    },
    {
        id: 14,
        second_id: 12,
        name: "Manchester United",
        mainColor: "#db0712",
        secondaryColor: "#000000"
    },
    {
        id: 15,
        second_id: 23,
        name: "Newcastle United",
        mainColor: "#000000",
        secondaryColor: "#ffffff"
    },
    {
        id: 16,
        second_id: 15,
        name: "Nottingham Forest",
        mainColor: "#ed3039",
        secondaryColor: "#ffffff"
    },
    {
        id: 17,
        second_id: 20,
        name: "Southampton",
        mainColor: "#ed3039",
        secondaryColor: "#ffffff"
    },
    {
        id: 18,
        second_id: 21,
        name: "Tottenham Hotspur",
        mainColor: "#ffffff",
        secondaryColor: "#131f54"
    },
    {
        id: 19,
        second_id: 25,
        name: "West Ham United",
        mainColor: "#410e1e",
        secondaryColor: "#94c0e6"
    },
    {
        id: 20,
        second_id: 38,
        name: "Wolverhampton Wanderers",
        mainColor: "#faba00",
        secondaryColor: "#000000"
    }
]

export class PremierLeagueAPI {
    /**
     * Creates an instance of the PremierLeagueAPI class.
     * Initializes the base URL for the Premier League API.
     * @param {number} [leagueId=8999] - The ID of the league.
     */
    constructor(leagueId = 8999) {
        this.url = "https://draft.premierleague.com/api";
        this.footaballApiUrl = "https://footballapi.pulselive.com/football";
        this.leagueId = leagueId;
    }

    /**
     * Fetches the details of the league.
     * @returns {Promise<Object>} - The league details.
     * @throws {Error} - If the fetch request fails.
     */
    async getDetails() {
        const response = await fetch(`${this.url}/league/${this.leagueId}/details`);
        if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
        return response.json();
    }

    /**
     * Fetches the users in the league.
     * @returns {Promise<Array>} - The list of users.
     * @throws {Error} - If the fetch request fails.
     */
    async getUsers() {
        const response = await fetch(`${this.url}/league/${this.leagueId}/details`);
        if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
        const data = await response.json();
        return data.league_entries.map((e) => ({
            ...e,
            name: e.entry_name,
            first_name: e.player_first_name,
        }));
    }

    async getStandings(details, users) {
        return details.standings.map((e) => ({
            id: e.league_entry,
            name: users.find(u => u.id === e.league_entry).name,
            user: users.find(u => u.id === e.league_entry).first_name,
            rank: e.rank,
            total: e.total,
            points_for: e.points_for,
            points_against: e.points_against,
            matches_won: e.matches_won,
            matches_lost: e.matches_lost,
            matches_drawn: e.matches_drawn
        }));
    }

    /**
     * Fetches the players in the league.
     * @returns {Promise<Array>} - The list of players.
     * @throws {Error} - If the fetch request fails.
     */
    async getPlayers() {
        const response = await fetch(`${this.url}/bootstrap-static`);
        if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
        const data = await response.json();
        return data.elements.map((e) => ({
            ...e,
            name: e.web_name,
            owner: null,
            team_code: data.teams.find((t) => t.id === e.team).code,
            team_name: data.teams.find((t) => t.id === e.team).name,
            team_primary_colour: teamColours.find((t) => t.id === e.team).mainColor,
            team_secondary_colour: teamColours.find((t) => t.id === e.team).secondaryColor,
        }));
    }

    /**
     * Fetches the picks for a user in a specific gameweek.
     * @param {Object} user - The user object.
     * @param {Array} players - The list of players.
     * @param {number} gameweek - The gameweek number.
     * @returns {Promise<Array>} - The list of picks.
     * @throws {Error} - If the fetch request fails.
     */
    async getPicks(user, players, gameweek) {
        const response = await fetch(`https://draft.premierleague.com/api/entry/${user.entry_id}/event/${gameweek}`);
        if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
        const data = await response.json();

        return data.picks.map((p) => ({...p, user: user.player_first_name}));
    }

    /**
     * Attaches owners to the players based on the picks.
     * @param {Array} players - The list of players.
     * @param {Array} picks - The list of picks.
     * @returns {Array} - The list of players with owners attached.
     */
    async attachOwners(players, picks) {
        picks.forEach((p) => {
            const player = players.find((pl) => pl.id === p.element);
            if (player) {
                player.owner = p.user;
            }
        });
        return players;
    }

    /**
     * Fetches the match results from the league details and users.
     * @param {Object} details - The league details.
     * @param {Array} users - The list of users.
     * @returns {Array} - The list of match results.
     */
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

    /**
     * Calculates the cumulative sum of points for each team in the match results.
     * @param {Array} matchResults - The list of match results.
     * @returns {Array} - The list of match results with cumulative points.
     */
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

    /**
     * Calculates the rankings for each gameweek based on the cumulative points.
     * @param {Array} matchResults - The list of match results with cumulative points.
     * @returns {Array} - The list of match results with rankings for each gameweek.
     */
    async getRankingsForGameweeks(matchResults) {
        const gameweeks = matchResults.map((m) => m.gameweek).filter((value, index, self) => self.indexOf(value) === index);
        const rankings = gameweeks.flatMap((g) => {
            const gameweekResults = matchResults.filter((m) => m.gameweek === g);
            const sortedResults = _.sortBy(gameweekResults, (m) => m.points_acc).reverse();

            let currentRank = 1;
            let previousPoints = sortedResults[0].points_acc;
            sortedResults[0].rank = currentRank;

            for (let i = 1; i < sortedResults.length; i++) {
                if (sortedResults[i].points_acc < previousPoints) {
                    currentRank++;
                }
                sortedResults[i].rank = currentRank;
                previousPoints = sortedResults[i].points_acc;
            }

            return sortedResults;
        });

        return rankings;
    }

    async getTeamStats(teamId, comp = 1, seasonId = 719) {
        const response = await fetch(
            `${this.footaballApiUrl}/stats/team/${teamId}?comps=${comp}&compSeasons=${seasonId}`
        );
        if (!response.ok) throw new Error(`fetch failed: ${response.status} for team ${teamId}`);
        return await response.json()
    }

    async getAllTeamStats() {
        const teamStats = []

        for (let i = 0; i <= teamColours.length - 1; i++) {
            const teamData = teamColours[i]

            const stats = await this.getTeamStats(teamData.second_id).then(data => data.stats);

            const result = stats.reduce((acc, row) => {
                acc[row.name] = row.value;
                return acc;
            }, {});
            teamStats.push({...teamData, ...result})
        }
        return teamStats
    }
}
