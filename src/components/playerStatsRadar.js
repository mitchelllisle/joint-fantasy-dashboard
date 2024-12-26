import {radarChart} from "./shared/radarChart.js";
import _ from "lodash";

export function playerStatsRadar(data, {width} = {}) {
    const filtered = data.filter(d => d.owner !== null);

    const totalPoints = _.sumBy(filtered, 'total_points');
    const minutes = _.sumBy(filtered, 'minutes');
    const assists = _.sumBy(filtered, 'assists');
    const clean_sheets = _.sumBy(filtered, 'clean_sheets');
    const goals_conceded = _.sumBy(filtered, 'goals_conceded');

    const chartData = _(filtered)
        .groupBy('owner')
        .map((items, owner) => ({
            name: owner,
            total_points: _.sumBy(items, 'total_points') / totalPoints,
            minutes: _.sumBy(items, 'minutes') / minutes,
            assists: _.sumBy(items, 'assists') / assists,
            clean_sheets: _.sumBy(items, 'clean_sheets') / clean_sheets,
            goals_conceded: _.sumBy(items, 'goals_conceded') / goals_conceded
        }))
        .value();

    return radarChart(chartData, {width});
}
