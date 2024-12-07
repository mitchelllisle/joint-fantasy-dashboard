---
theme: light
title: Dashboard
toc: false
---

```js
import {PointsPerWeek} from "./components/pointsPerWeek.js";
import {WaffleByUser} from "./components/waffleByUser.js";
```

```js
const bootstrapStatic = FileAttachment("data/bootstrapStatic.json").json();
const details = FileAttachment("data/details.json").json();
const matchResults = FileAttachment("data/matchResults.json").json();
```

```js
const userInFirst = matchResults.data.reduce((max, current) => 
    current.points_acc > max.points_acc ? current : max
);

const userInLast = matchResults.data.reduce((max, current) => 
    current.points_acc < max.points_acc ? current : max
);
```

<div class="hero">
  <h1>[JOINT] Fantasy Dashboard</h1>
</div>

<div class="hero">
  <h2>${matchResults.sentence}</h2>
</div>

<div class="grid grid-cols-2">
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
    ${resize((width) => PointsPerWeek(matchResults.data, {width}))}
  </div>
</div>


<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => WaffleByUser(details, {width}))}
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
  font-family: var(--sans-serif);
  margin: 2rem 0 3rem;
  text-wrap: balance;
  text-align: left;
}

.hero h1 {
  margin: 1rem 0;
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
  font-size: 18px;
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
