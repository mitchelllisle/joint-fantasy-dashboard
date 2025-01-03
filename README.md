![](src/epl.png)

# Joint Fantasy Dashboard

Joint Fantasy Dashboard is a web application built using the [Observable Framework](https://observablehq.com/framework/). 
This project provides a dashboard to manage and visualize English Premier League Draft mode fantasy competitions.

## Installation

To install the required dependencies, run:

```bash
yarn install
```

## Development

To start the local preview server, run:

```bash
yarn dev
```

Then visit [http://localhost:3000](http://localhost:3000) to preview your app.

## Project Structure

A typical Framework project looks like this:

```plaintext
.
├─ src
│  ├─ components
│  │  └─ timeline.js           # An importable module
│  ├─ data
│  │  ├─ launches.csv.js       # A data loader
│  │  └─ events.json           # A static data file
│  ├─ example-dashboard.md     # A page
│  ├─ example-report.md        # Another page
│  └─ index.md                 # The home page
├─ .gitignore
├─ observablehq.config.js      # The app config file
├─ package.json
└─ README.md
```

- **`src`**: This is the source root where your source files live. Pages go here. Each page is a Markdown file. Observable Framework uses [file-based routing](https://observablehq.com/framework/routing).
- **`src/index.md`**: This is the home page for your app. You can have as many additional pages as you’d like, but you should always have a home page, too.
- **`src/data`**: You can put [data loaders](https://observablehq.com/framework/data-loaders) or static data files anywhere in your source root, but we recommend putting them here.
- **`src/components`**: You can put shared [JavaScript modules](https://observablehq.com/framework/imports) anywhere in your source root, but we recommend putting them here. This helps you keep your code organized.
- **`observablehq.config.js`**: This is the [app configuration](https://observablehq.com/framework/config) file, such as the pages and sections in the sidebar navigation, and the app’s title.

## Command Reference

| Command           | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `yarn install`    | Install or reinstall dependencies                        |
| `yarn dev`        | Start local preview server                               |
| `yarn build`      | Build your static site, generating `./dist`              |
| `yarn deploy`     | Deploy your app to Observable                            |
| `yarn clean`      | Clear the local data loader cache                        |
| `yarn observable` | Run commands like `observable help`                      |

For more information, see the [Observable Framework Getting Started guide](https://observablehq.com/framework/getting-started).
