# Project Steering — Focus Dashboard

## Project Overview
A personal productivity dashboard built as a mini project for CodingCamp (16 November 2026 batch) by Rifaldi Munggaran.

## Tech Stack
- HTML5 — page structure
- CSS3 — styling and theming (single file: `css/style.css`)
- Vanilla JavaScript — all interactivity (single file: `js/app.js`)
- Browser LocalStorage API — client-side data persistence
- No frameworks, no backend, no build tools required

## Folder Structure
```
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── .kiro/
    ├── steering/
    │   └── project.md
    └── specs/
        └── requirements.md
```

## Coding Conventions
- Use `'use strict'` in JavaScript
- Vanilla JS only — no jQuery, React, Vue, or any framework
- CSS custom properties (variables) for all design tokens
- BEM-inspired class naming for CSS
- Keep code clean, readable, and well-commented
- All user data persisted via LocalStorage only
