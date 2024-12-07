---
theme: light
title: Dashboard
toc: false
---

<div class="hero">
  <h1>[JOINT] Fantasy Dashboard</h1>
</div>

```js
const bootstrapStatic = FileAttachment("data/bootstrapStatic.json").json();
const details = FileAttachment("data/details.json").json();
const matchResults = FileAttachment("data/matchResults.json").json();
```

```js
function pointsPerWeek(data, {width} = {}) {
  return Plot.plot({
    style: "overflow: visible;",
    width,
    y: {grid: true},
    marks: [
      Plot.ruleY([0]),
      Plot.axisY({label: "Points"}),
      Plot.axisX({label: "Gamewek"}),
      Plot.lineY(data, {x: "gameweek", y: "points_acc", stroke: "team", curve: "natural", marker: true, tip: true}),
      Plot.text(data, Plot.selectLast({x: "gameweek", y: "points_acc", z: "team", text: "team", textAnchor: "start", dx: 3}))
    ]
  });
}
```

<div class="hero">
  <h2>${matchResults.sentence}</h2>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => pointsPerWeek(matchResults.data, {width}))}
  </div>
</div>

```js
function waffleByUser(rawData, {width} = {}) {
  const totalGameweeks = 38;

  const won = "#13cf00";
  const lose = "#d81920";
  const draw = "#76766f";

  const data = rawData.flatMap(d => [
    ...Array(d.matches_won).fill({user: d.user, result: "won"}),
    ...Array(d.matches_lost).fill({user: d.user, result: "lost"}),
    ...Array(d.matches_drawn).fill({user: d.user, result: "drawn"})
  ]);

  return Plot.plot({
    axis: null,
    label: null,
    width,
    height: 300,
    marginTop: 20,
    marginBottom: 70,
    title: "Match Results",
    marks: [
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
                fill: "black",
                fontSize: 18,
                fontWeight: "bold",
            }
        ),
        Plot.text(rawData, {
            fx: "user", text: (_) => "Win Percentage",
             frameAnchor: "bottom",
                lineAnchor: "top",
                dy: 50,
                fill: "black",
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
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => waffleByUser(details, {width}))}
  </div>
</div>

<div class="card" style="padding: 0;">
  ${Inputs.table(details, {
    columns: [
        "rank",
        "user",
        "total",
        "matches_won",
        "matches_lost",
        "matches_drawn",
        "points_for",
        "points_against"
    ],
    header: {
        "rank": "Rank",
        "user": "User",
        "total": "Total",
        "matches_won": "Won",
        "matches_lost": "Lost",
        "matches_drawn": "Draw",
        "points_for": "Points For",
        "points_against": "Points Against"
    }
  })}
</div>

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 2rem 0 3rem;
  text-wrap: balance;
  text-align: left;
}

.hero h1 {
  margin: 1rem 0;
  padding: 1rem 0;
  max-width: none;
  font-size: 6vh !important;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(90deg, #02efff,  #00ff87);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: none;
  font-size: 20px;
  /* font-weight: 500; */
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>
