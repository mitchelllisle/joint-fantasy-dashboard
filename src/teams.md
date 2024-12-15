---
theme: [dashboard]
title: Dashboard
toc: false
---

```js
import {teamPlayersScatter} from "./components/teamPlayersScatter.js";
import {teamComparisonScatter} from "./components/teamComparisonScatter.js";
```

```js
const bootstrapStatic = FileAttachment("data/bootstrapStatic.json").json();
const details = FileAttachment("data/details.json").json();
const matchResults = FileAttachment("data/matchResults.json").json();
const teamSeasonStats = FileAttachment("data/teamSeasonStats.json").json();
```

## Premier League Analysis


<div class="grid grid-cols-2">
  <div class="card">
    ${resize((width) => teamComparisonScatter(teamSeasonStats, {width}))}
  </div>
</div>

<hr>

## Team Analysis

```js
const team = view(
  Inputs.select(
      bootstrapStatic.data.map((d) => d.team_name),
      {unique: true, sort: true, label: null}
  )
);
```

```js
const teamData = bootstrapStatic.data.filter(d => d.team_name === team);
```


```js
const teamCode = teamData[0].team_code;
const teamLogo = `https://resources.premierleague.com/premierleague/badges/50/t${teamCode}@x2.png`;
```

```js
html`<img src=${teamLogo} width="60px"></img><h1 style="display: table-caption; margin-left: 10px; min-width: 500px;">${team}</h1>`
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => teamPlayersScatter(teamData, {width}))}
  </div>
</div>

<style>

.inputs-3a86ea-input {
    height: 30px;
    float: right;
}

</style>
