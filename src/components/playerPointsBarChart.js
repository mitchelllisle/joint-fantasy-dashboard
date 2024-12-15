import {barChart} from "./shared/barChart.js";

export function playerPointsBarChart(data, {width} = {}) {
    const x = "gameweek";
    const y = "total_points";
    const z = "team";

    return barChart(data,{
        title: "Score per Gameweek",
        subtitle: "Shows the total score for each player over the course of the season",
        color: {
            domain: ["Mitchell", "Jay", "Ryan", "Kerrod"],
            range: ["#4269d0", "#ff725c", "#6cc5b0", "#efb118"],
            legend: true
        },
        x, y ,z, width
    });
}
