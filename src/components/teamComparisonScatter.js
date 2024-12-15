import {scatterChart} from "./shared/scatterChart.js";

export function teamComparisonScatter(data, {width} = {}) {
    const x = "goals";
    const y = "goals_conceded";
    const z = "name";

    const colour = {
        domain: data.map(d => d.name),
        range: data.map(d => d.mainColor),
        legend: false
    };
    return scatterChart(
        data,
        {
            width,
            x,y,z,
            r: 15,
            title: "Team Goals Scored vs Goals Conceded",
            subtitle: "Shows the number of goals scored and conceded by each team",
            stroke: null,
            color: colour,
            text: (d) => d.name
    })
}
