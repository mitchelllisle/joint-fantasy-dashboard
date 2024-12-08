import * as Plot from "npm:@observablehq/plot";


export function PlayerScatter(data, {width} = {}) {
    const x = "total_points";
    const y = "minutes";
    const fill = "owner";

    const owned = data.filter(d => d.owner !== null);
    const unowned = data.filter(d => d.owner === null);

    return Plot.plot({
        title: "Player Minutes vs Points",
        width,
        grid: true,
        color: {
            domain: ["Mitchell", "Jay", "Ryan", "Kerrod", null],
            range: ["#ff725c", "#4269d0", "#6cc5b0", "#efb118", "#b1b2b4"],
            legend: true
        },
        x: {label: "Points"},
        y: {label: "Minutes"},
        symbol: {legend: true},
        marks: [
            Plot.dot(unowned, {x: x, y: y, r: 10, opacity: 0.2, fill: fill, channels: {name: "name"}, tip: true}),
            Plot.dot(owned, {x: x, y: y, r: 10, opacity: 0.8, fill: fill, channels: {name: "name"}, tip: true}),
        ]
      })
}
