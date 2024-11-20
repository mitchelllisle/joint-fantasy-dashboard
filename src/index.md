---
theme: dashboard
title: Dashboard
toc: false
---

<div class="hero">
  <h1>[JOINT] Fantasy Dashboard</h1>
  <h2>Welcome to your new app! Edit&nbsp;<code style="font-size: 90%;">src/index.md</code> to change this page.</h2>
  <a href="https://observablehq.com/framework/getting-started">Get started<span style="display: inline-block; margin-left: 0.25rem;">↗︎</span></a>
</div>

```js
const bootstrapStatic = FileAttachment("data/bootstrapStatic.json").json();
const details = FileAttachment("data/details.json").json();

```

```js
function top10Players(data, {width} = {}) {
  return Plot.plot({
    title: "Total Points by Player",
    width,
    height: 300,
    y: {grid: true, label: "Total Points"},
    x: {label: "Player"},
    marks: [
      Plot.barY(data, Plot.groupX({y: "sum"}, {x: "name", y: "total_points", fill: "#C8553D", tip: true})),
      Plot.ruleY([0])
    ]
  });
}
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => top10Players(bootstrapStatic, {width}))}
  </div>
</div>

```js
function waffleByUser(rawData, {width} = {}) {
  const totalGameweeks = 38;

  const won = "#3ca951";
  const lose = "#ff725c";
  const draw = "#4269d0";

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
            rx: "100%"
        })),
        Plot.text(rawData, {
                fx: "user", 
                text: (d) => (d.matches_won / (d.matches_won + d.matches_lost + d.matches_drawn)).toLocaleString("en-US", {style: "percent"}), 
                frameAnchor: "bottom",
                lineAnchor: "top",
                dy: 30,
                fill: won,
                fontSize: 18,
                fontWeight: "bold"
            }
        ),
        Plot.text(rawData, {
            fx: "user", text: (_) => "Win Percentage",
             frameAnchor: "bottom",
                lineAnchor: "top",
                dy: 50,
                fill: won,
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
        "matches_won",
        "matches_lost",
        "matches_drawn",
        "points_for",
        "points_against"
    ],
    header: {
        "rank": "Rank",
        "user": "User",
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
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 1rem 0;
  padding: 1rem 0;
  max-width: none;
  font-size: 6vh !important;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>
