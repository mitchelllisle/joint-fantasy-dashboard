import * as Plot from "npm:@observablehq/plot";

export function playerScatter(data, {width} = {}) {
    const x = "total_points";
    const y = "minutes";
    const fill = "owner";

    const owned = data.filter(d => d.owner !== null);
    const unowned = data.filter(d => d.owner === null);

    return Plot.plot({
        title: "Player Minutes vs Points",
        subtitle: "Shows the relationship between minutes played and points scored clustered by owner.",
        width,
        grid: true,
        color: {
            domain: ["Mitchell", "Jay", "Ryan", "Kerrod", null],
            range: ["#4269d0", "#ff725c", "#6cc5b0", "#efb118", "#626060"],
            legend: true
        },
        x: {label: "Points"},
        y: {label: "Minutes"},
        symbol: {legend: true},
        marks: [
            Plot.dot(unowned, {x: x, y: y, r: 10, opacity: 0.2, fill: fill}),
            Plot.dot(owned, {x: x, y: y, r: 10, opacity: 0.8, fill: fill}),
            Plot.tip(data, Plot.pointer({
                x: x,
                y: y,
                channels: {Owner: "owner", Name: "name"},
            })),
        ]
      })
}
