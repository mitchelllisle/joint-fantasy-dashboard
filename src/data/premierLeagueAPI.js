import _ from "lodash"

export class PremierLeagueAPI {
    /**
     * Creates an instance of the PremierLeagueAPI class.
     * Initializes the base URL for the Premier League API.
     * @param {number} [leagueId=8999] - The ID of the league.
     */
    constructor(leagueId = 8999) {
        this.url = "https://draft.premierleague.com/api";
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
        return data.league_entries;
    }

    async getStandings(details) {
        const users = details.league_entries.map((e) => ({
            id: e.id,
            name: e.entry_name,
            first_name: e.player_first_name,
        }));
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
            id: e.id,
            name: e.web_name,
            team: e.team,
            minutes: e.minutes,
            total_points: e.total_points,
            owner: null
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
     * Extracts users from the league details.
     * @param {Object} details - The league details.
     * @returns {Array} - The list of users.
     */
    async getUsersFromDetails(details) {
        return details.league_entries.map((e) => ({
            id: e.id,
            name: e.entry_name,
            first_name: e.player_first_name,
        }));
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
}
