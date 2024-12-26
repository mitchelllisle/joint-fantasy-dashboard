import * as Plot from "npm:@observablehq/plot";
import {noDataTextMark} from "./shared/noDataTextMark.js";

export function pointsBarChart(data, {width} = {}) {
    const x = "gameweek";
    const y = "total_points";
    const z = "team";

    const nTeams = new Set(data.map(d => d.team)).size;

    let movingWindow;
    if (nTeams === 1) {
        movingWindow = Plot.lineY(data, Plot.windowY(5, {x: x, y: y, curve: "cardinal", stroke: "white"}))
    }
    return Plot.plot({
        title: "Score per Gameweek",
        subtitle: "Shows the total score for each player over the course of the season",
        style: "overflow: visible;",
        width,
        y: {grid: true},
        color: {
            domain: ["Mitchell", "Jay", "Ryan", "Kerrod"],
            range: ["#4269d0", "#ff725c", "#6cc5b0", "#efb118"],
            legend: true
        },
        marks: [
            Plot.ruleY([0]),
            Plot.barY(data, {x: x, y: y, fill: z, order: z, tip: true}),
            movingWindow,
            ...noDataTextMark(data)
        ]
    });
}