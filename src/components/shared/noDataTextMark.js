import * as Plot from "npm:@observablehq/plot";

export function noDataTextMark(data) {
    return (data.length === 0 ? [Plot.text([{
        x: 0,
        y: 0,
        text: "No data available for this chart. Try a different selection.",
        textAnchor: "middle",
    }], {x: "x", y: "y", dy: -10, fontSize: 16, text: "text"})] : [])
}
