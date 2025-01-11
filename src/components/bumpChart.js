import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import {colours} from "./shared/colours.js";

export function bumpChart(data, {x = "gameweek", y = "rank", z = "team", width} = {}) {
    const rank = Plot.stackY2({x, z, order: y});
    const [xmin, xmax] = d3.extent(Plot.valueof(data, x));
    return Plot.plot({
        title: "Rank Across Gameweeks",
        subtitle: "Shows the rankings as they change throughout the season",
        width,
        x: {
            [width < 480 ? "insetRight" : "inset"]: 30,
            label: null,
            grid: true
        },
        y: {
            axis: null,
            inset: 20,
            reverse: true
        },
        color: colours,
        marks: [
            Plot.lineY(data, {
                ...rank,
                stroke: z,
                strokeWidth: 26,
                curve: "bump-x",
                sort: {color: "y", reduce: "first"},
                render: halo({stroke: "var(--theme-background-alt)", strokeWidth: 33})
            }),
            Plot.text(data, {
                ...rank,
                text: rank.y,
                fill: "black",
                stroke: z,
                tip: true
            }),
            width < 480 ? null : Plot.text(data, {
                ...rank,
                filter: (d) => d[x] <= xmin,
                text: z,
                dx: -20,
                textAnchor: "end"
            }),
            Plot.text(data, {
                ...rank,
                filter: (d) => d[x] >= xmax,
                text: z,
                dx: 20,
                textAnchor: "start"
            })
        ]
    })
}

function halo({stroke = "currentColor", strokeWidth = 3} = {}) {
    return (index, scales, values, dimensions, context, next) => {
        const g = next(index, scales, values, dimensions, context);
        for (const path of [...g.childNodes]) {
            const clone = path.cloneNode(true);
            clone.setAttribute("stroke", stroke);
            clone.setAttribute("stroke-width", strokeWidth);
            path.parentNode.insertBefore(clone, path);
        }
        return g;
    };
}
