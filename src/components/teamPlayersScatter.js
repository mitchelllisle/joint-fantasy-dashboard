import {scatterChart} from "./shared/scatterChart.js";

export function teamPlayersScatter(data, {width} = {}) {
    const x = "total_points";
    const y = "minutes";
    const z = data[0].team_primary_colour;
    const stroke = data[0].team_secondary_colour;

    const colour = {
        domain: data.map(d => d.team_name),
        range: data.map(d => d.team_primary_colour),
        legend: true
    };
    console.log(colour);
    return scatterChart(
        data,
        {
            width,
            x,y,z,
            title: "Player Minutes vs Points",
            subtitle: "Shows the relationship between minutes played and points scored clustered by owner.",
            stroke,
            text: (d) => d.name
    })
}
