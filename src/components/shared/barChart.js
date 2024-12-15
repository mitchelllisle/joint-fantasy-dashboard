import * as Plot from "npm:@observablehq/plot";
import {noDataTextMark} from "./noDataTextMark.js";

export function barChart(data, {width, x, y, z, title, subtitle, color} = {}) {
    return Plot.plot({
        title,
        subtitle,
        style: "overflow: visible;",
        width,
        y: {grid: true},
        color,
        marks: [
            Plot.ruleY([0]),
            Plot.barY(data, {x: x, y: y, fill: z, order: z, tip: true}),
            ...noDataTextMark(data)
        ]
    });
}
