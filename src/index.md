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
import {pointsBarChart} from "./components/pointsBarChart.js";
```

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

```js
const bootstrapStatic = FileAttachment("data/bootstrapStatic.json").json();
const details = FileAttachment("data/details.json").json();
const matchResults = FileAttachment("data/matchResults.json").json();
```

```js
const maxGameweek = d3.max(matchResults.data, d => d.gameweek);
```

```js
function filterForRank(data, rank, maxGameweek) {
  return data.filter((d) => d.rank === rank && d.gameweek === maxGameweek)[0];
};

const userInFirst = filterForRank(matchResults.data, 1, maxGameweek);
const userInSecond = filterForRank(matchResults.data, 2, maxGameweek);
const userInThird = filterForRank(matchResults.data, 3, maxGameweek);
const userInLast = filterForRank(matchResults.data, details.length, maxGameweek);

const firstToSecondPointsGap = Math.abs(userInFirst.points_acc - userInSecond.points_acc);
const secondToThirdPointsGap = Math.abs(userInSecond.points_acc - userInThird.points_acc);
const thirdToLastPointsGap = Math.abs(userInThird.points_acc - userInLast.points_acc);
const lastToFirstPointsGap = Math.abs(userInLast.points_acc - userInFirst.points_acc);
```

## Gameweek ${maxGameweek}: ${matchResults.title}

<div>
  <p style="max-width: 1000px;">${matchResults.sentence}</p>
</div>


<div class="grid grid-cols-4">
  <a class="card" style="color: inherit;">
    <h2>🏆 1st Place</h2>
    <br>
    <span class="big">${userInFirst.team} 🎉</span>
    <br>
    <br>
    <span class="muted">
        ${userInFirst.team} is winning with <b style="color: #6cc5b0">${userInFirst.points_acc}</b> points. 
        He is <b style="color: #6cc5b0">${firstToSecondPointsGap}</b> points off ${userInSecond.team} in second 
        and <b style="color: #6cc5b0">${lastToFirstPointsGap}</b> points away from last.
    </span>
  </a>
  <a class="card" style="color: inherit;">
    <h2>💰 Last Place</h2>
    <br>
    <span class="big">${userInLast.team} 😰</span>
    <br>
    <br>
    <span class="muted">
        ${userInLast.team} is in last place on <b style="color: #ff725c">${userInLast.points_acc}</b> points. 
        He is <b style="color: #ff725c">${thirdToLastPointsGap}</b> points off ${userInThird.team} in third 
        and <b style="color: #ff725c">${lastToFirstPointsGap}</b> off first place.
    </span>
  </a>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => BumpChart(matchResults.data, {width}))}
  </div>
</div>

<style>

.inputs-3a86ea-input {
    height: 30px;
    float: right;
}

</style>

<hr>

## Breakdown by Players
Choose a player to see their performance across a range of metrics or select "All" to everyone's performance.

```js
const player = view(
  Inputs.select(
      ["All", "None"].concat(details.map((d) => d.user)),
      {unique: true, label: null}
  )
);
```

```js
function filterForInput(data, player, field) {
    return data.filter((d) => {
        if (player === "All") {
            return true;
        } else if (player === "None") {
            return d[field] === null;
        } else {
            return d[field] === player
        }
    })
};

const bootstrapStaticUser = filterForInput(bootstrapStatic.data, player, "owner");
const matchResultsUser = filterForInput(matchResults.data, player, "team");
const detailsUser = filterForInput(details, player, "user");
```

<div class="grid grid-cols-2">
  <div class="card">
    ${resize((width) => PointsPerWeek(matchResultsUser, {width}))}
  </div>
  <div class="card">
    ${resize((width) => PlayerScatter(bootstrapStaticUser, {width}))}
  </div>
</div>


<div class="grid grid-cols-2">
  <div class="card">
    ${resize((width) => pointsBarChart(matchResultsUser, {width}))}
  </div>
  <div class="card">
    ${resize((width) => WaffleByUser(detailsUser, {width}))}
  </div>
</div>

<div class="grid grid-cols-1">
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
</div>