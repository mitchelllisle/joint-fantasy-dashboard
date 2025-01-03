import * as Plot from "npm:@observablehq/plot";

export function scatterChart(data, {width, height, x, y, z, title, subtitle, stroke, color, text = null, r = 10} = {}) {
    const xLabel = x.slice(0,1).toUpperCase() + x.slice(1);
    const yLabel = y.slice(0,1).toUpperCase() + y.slice(1);
    let label;

    if (text !== null) {
        label = Plot.text(data, {x: x, y: y, fontWeight: "bold", text, dy: 20, lineAnchor: "bottom"})}

    return Plot.plot({
        title,
        subtitle,
        width,
        grid: true,
        color,
        x: {label: xLabel},
        y: {label: yLabel},
        symbol: {legend: true},
        marks: [
            Plot.dot(data, {x: x, y: y, r: r, opacity: 0.6, stroke, fill: z}),
            Plot.tip(data, Plot.pointer({x: x, y: y})),
            label,
        ]
    })
}
