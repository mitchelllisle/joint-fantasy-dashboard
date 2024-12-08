import * as Plot from "npm:@observablehq/plot";


export function PointsPerWeek(data, {width} = {}) {
    return Plot.plot({
      title: "Points per Gameweek",
      style: "overflow: visible;",
      width,
      y: {grid: true},
      marks: [
        Plot.ruleY([0]),
        Plot.axisY({label: "Points"}),
        Plot.axisX({label: "Gameweek"}),
        Plot.lineY(data, {x: "gameweek", y: "points_acc", stroke: "team", curve: "natural", marker: true, tip: true}),
        Plot.text(data, Plot.selectLast({x: "gameweek", y: "points_acc", z: "team", text: "team", textAnchor: "start", dx: 3}))
      ]
    });
  }
