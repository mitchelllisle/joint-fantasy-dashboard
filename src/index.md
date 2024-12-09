---
theme: [dashboard]
title: Dashboard
toc: false
---


```js
import {PointsPerWeek} from "./components/pointsPerWeek.js";
import {WaffleByUser} from "./components/waffleByUser.js";
import {PlayerScatter} from "./components/playerScatter.js";
import {BumpChart} from "./components/bumpChart.js";
```

```js
const bootstrapStatic = FileAttachment("data/bootstrapStatic.json").json();
const details = FileAttachment("data/details.json").json();
const matchResults = FileAttachment("data/matchResults.json").json();
```

```js
const maxGameweek = d3.max(matchResults.data, d => d.gameweek);
```

```js
const userInFirst = matchResults.data.reduce((max, current) => 
    current.points_acc > max.points_acc ? current : max
);

const userInLast = matchResults.data.reduce((max, current) => 
    current.points_acc < max.points_acc ? current : max
);
```

## The results after gameweek ${maxGameweek}


<div>
  <p style="max-width: 1000px;">${matchResults.sentence}</p>
</div>


<div class="grid grid-cols-4">
  <a class="card" style="color: inherit;">
    <h2>🏆 1st Place</h2>
    <br>
    <span class="big">${userInFirst.team}</span>
  </a>
  <a class="card" style="color: inherit;">
    <h2>💰 Last Place</h2>
    <br>
    <span class="big">${userInLast.team}</span>
  </a>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => BumpChart(matchResults.data, {width}))}
  </div>
</div>

<div class="grid grid-cols-2">
  <div class="card">
    ${resize((width) => PointsPerWeek(matchResults.data, {width}))}
  </div>
  <div class="card">
    ${resize((width) => PlayerScatter(bootstrapStatic, {width}))}
  </div>
</div>

```js
function sparkbar(max) {
  return (x) => htl.html`<div style="
    background: var(--theme-green);
    color: black;
    font: 10px/1.6 var(--sans-serif);
    width: ${100 * x / max}%;
    float: right;
    padding-right: 3px;
    box-sizing: border-box;
    overflow: visible;
    display: flex;
    justify-content: end;">${x.toLocaleString("en-US")}`
}
```

<div class="grid grid-cols-2">
  <div class="card" style="padding: 0;">
      ${Inputs.table(details, {
        format: {
            total: sparkbar(d3.max(details, d => d.total)),
        },  
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
  <div class="card">
    ${resize((width) => WaffleByUser(details, {width}))}
  </div>
</div>
