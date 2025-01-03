import * as Plot from "npm:@observablehq/plot";
import {jay, mitchell, ryan, kerrod, colours} from "./shared/colours.js";
import {calculateGini} from "./shared/gini.js";
import _ from "lodash";


export function giniIndexChart(data , {width}) {
    const owned = data.filter(d => d.owner !== null);

    const chartData = _(owned)
        .groupBy(d => d.owner)
        .map((ownerData, owner) => {
            const totalPoints = ownerData.map(d => d.total_points);
            return {
                owner,
                gini: calculateGini(totalPoints) * 100,
                maxPoints: Math.max(...totalPoints),
            };
        })
        .value();

    return Plot.plot({
        title: "Gini Index by Owner",
        subtitle: `
            A measure of inequality in points scored. 0% = perfectly equal, 100 = one player has all the points.
            The lower the score, the more players are contributing the points. Size of hexagon represents max points 
            scored by a single player.`,
        width,
        color: {...colours, legend: false},
        x: {domain: [0, 100], label: "Gini Index"},
        r: {range: [-5, 20]},
        marginTop: 40,
        marks: [
            Plot.hexagon(
                chartData, {x: "gini", tip: true, r: "maxPoints", fill: "owner", fillOpacity: 0.8, strokeWidth: 10}
            ),
            Plot.text(chartData, {x: "gini", dy: -40, rotate: -90, text: d => d.owner}),
        ]
    });
}
