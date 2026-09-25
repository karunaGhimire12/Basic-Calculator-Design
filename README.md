# Calculator

A simple, clean calculator built with plain HTML, CSS and JavaScript. No frameworks, no build tools - just open the file and it works.

## Features

- Basic arithmetic: `+`, `−`, `×`, `÷`
- Correct operator precedence and left-to-right evaluation (no `eval()`)
- Decimal input, max 15 digits per number
- Sign toggle (`+/−`), percent (`%`)
- Proper minus signs in results (e.g. `−7`, not `-7`)
- Full keyboard support: digits, `.` `,` `+` `-` `*`/`x` `/` `Enter`/`=` `Backspace` `Esc`/`Delete` `%` `n`
- `Error` state for invalid input (e.g. division by zero), cleared with `C`
- Minimal responsive layout that works on desktop and mobile

## Getting started

No installation required.

```bash
start index.html
```

## Project structure

```
calculator/
├── index.html   # markup: display + 4x5 button grid
├── style.css    # minimal monochrome styling, CSS grid layout
├── script.js    # all calculator logic and event handling
└── README.md
```

## A note on this repo

I built this project about a year ago as a way to learn the basics of HTML, CSS and JavaScript. I did not know about GitHub back then, so the project just sat on my computer for a whole year. I recently discovered what GitHub is and finally got around to uploading it.

So this is a learning project from a beginner, not a polished, actively maintained calculator. Please treat it as such - suggestions and improvements are very welcome.
