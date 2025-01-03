import * as Plot from "@observablehq/plot";
import _ from "lodash";

export function mostImportantPlayer(data: Plot.Data, {width, height}): Plot.Plot {
    const first = _(data).take(1).value()[0];
    const team = first.team_name;

    const facets = [
        "bps",
        "clean_sheets",
        "goals_scored",
        "assists",
        "total_points",
    ];

    // Calculate total for each facet
    const totals = facets.reduce((acc, facet) => {
        acc[facet] = _.sumBy(data, facet);
        return acc;
    }, {});

    // Transform data to long format, include rank, and take top 10 for each stat
    const chartData = facets.flatMap(facet => {
        const rankedData = _(data)
            .groupBy('web_name')
            .map((items, web_name) => ({
                web_name,
                stat: facet,
                value: _.sumBy(items, facet),
                pct_value: (_.sumBy(items, facet) / totals[facet])
            }))
            .orderBy('value', 'desc')
            .value();

        return rankedData.map((item, index) => ({
            ...item,
            rank: index + 1
        }));
    });

    console.log(chartData);
    return Plot.plot({
        title: `Most Important Players for ${team}`,
        width,
        height,
        marginBottom: 60,
        marginLeft: 70,
        marginRight: 20,
        x: {percent: true, nice: true, label: null, domain: [0, 100]},
        fy: {label: null},
        marks: [
            Plot.barX(
                chartData,
                Plot.stackX(
                    {x: "pct_value", fy: "stat", tip: true, fill: "#7b3294", fillOpacity: 0.4, inset: 1.5}
                )
            ),
            Plot.textX(
                chartData.filter(d => d.pct_value >= 0.06),
                Plot.stackX({
                    x: "pct_value",
                    fy: "stat",
                    fontWeight: "bold",
                    text: d => {
                        if (d.web_name.length > 9 && d.pct_value <= 0.09) {
                            return `${d.web_name.slice(0, 7)}...`;
                        } else {
                            return d.web_name;
                        }
                    }
                }
                )
            ),
        ]
    });
}
