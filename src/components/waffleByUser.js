import * as Plot from "npm:@observablehq/plot";
import {noDataTextMark} from "./shared/noDataTextMark.js";

export function waffleByUser(rawData, {width} = {}) {
    const totalGameweeks = 38;

    const won = "#6cc5b0";
    const lose = "#ff725c";
    const draw = "#4269d0";

    const data = rawData.flatMap(d => [
        ...Array(d.matches_won).fill({user: d.user, result: "won"}),
        ...Array(d.matches_lost).fill({user: d.user, result: "lost"}),
        ...Array(d.matches_drawn).fill({user: d.user, result: "drawn"})
    ]);
    console.log(data);
    return Plot.plot({
        title: "Match Results",
        subtitle: "Shows the results of each match played by each player",
        axis: null,
        label: null,
        width,
        height: 300,
        marginTop: 20,
        marginBottom: 70,
        marks: [
            ...noDataTextMark(data),
            Plot.axisFx({lineWidth: 10, anchor: "bottom"}),
            Plot.waffleX({length: 1}, {x: totalGameweeks, fillOpacity: 0.4, rx: "100%"}),
            Plot.waffleX(data, Plot.groupZ({x: "count"}, {
                fill: "result",
                fx: "user",
                rx: "100%",
            })),
            Plot.text(rawData, {
                    fx: "user",
                    text: (d) => (d.matches_won / (d.matches_won + d.matches_lost + d.matches_drawn)).toLocaleString("en-US", {style: "percent"}),
                    frameAnchor: "bottom",
                    lineAnchor: "top",
                    dy: 30,
                    fill: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                }
            ),
            Plot.text(rawData, {
                    fx: "user", text: (_) => "Win Percentage",
                    frameAnchor: "bottom",
                    lineAnchor: "top",
                    dy: 50,
                    fill: "white",
                    fontSize: 12,
                    fontWeight: "bold"
                }
            )

        ],
        color: {
            domain: ["won", "lost", "drawn"],
            range: [won, lose, draw],
            legend: true
        }
    });
}