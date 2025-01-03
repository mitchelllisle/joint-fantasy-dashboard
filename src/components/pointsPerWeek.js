import * as Plot from "npm:@observablehq/plot";
import {noDataTextMark} from "./shared/noDataTextMark.js";
import {colours} from "./shared/colours.js";


export function pointsPerWeek(data, {width} = {}) {
    const x = "gameweek";
    const y = "points_acc";
    const stroke = "team";

    return Plot.plot({
        title: "Points per Gameweek",
        subtitle: "Shows a cumulative points total for each player over the course of the season",
        style: "overflow: visible;",
        width,
        y: {grid: true},
        color: {...colours, legend: true},
        marks: [
            Plot.ruleY([0]),
            Plot.axisY({label: "Points"}),
            Plot.axisX({label: "Gameweek"}),
            Plot.lineY(data, {
                x: x,
                y: y,
                stroke: stroke,
                curve: "natural",
                marker: "circle-stroke",
                tip: true
            }),
            Plot.text(data, Plot.selectLast({
                x: x,
                y: y,
                z: stroke,
                text: stroke,
                textAnchor: "start",
                dx: 3
            })),
            ...noDataTextMark(data)
        ]
    });
}
