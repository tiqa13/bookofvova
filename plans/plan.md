# Book of Vova - Slot Machine Project Plan

## Overview
"Book of Vova" is a custom 5x3 slot machine web game. It will be built using plain HTML, CSS, and vanilla JavaScript, ensuring high performance without the need for external frameworks or game engines. Custom PNGs and GIFs will be used for symbols and animations.

## Tech Stack
*   **HTML5:** Structure of the game (canvas or DOM-based reels).
*   **CSS3:** Styling, layout (CSS Grid/Flexbox), and spinning animations (CSS transitions or keyframes).
*   **Vanilla JavaScript (ES6+):** Game logic, state management, RNG (Random Number Generation), and win calculation.

## Project Structure
```text
/
├── index.html          # Main entry point, structure of the slot machine
├── css/
│   └── style.css       # Game styles, layouts, and CSS animations
├── js/
│   ├── main.js         # Game initialization and UI binding
│   ├── slotLogic.js    # Core mechanics: spinning, RNG, stopping
│   └── winChecker.js   # Payline evaluation and win calculations
└── assets/
    ├── symbols/        # PNGs for the reel symbols
    ├── animations/     # GIFs for winning animations or expanding symbols
    ├── ui/             # Buttons, background, frames
    └── sounds/         # (Optional) Sound effects for spinning, winning
```

## Core Mechanics & Logic
1.  **Symbols Configuration:** Define a set of symbols, their weights (probability of appearing), and their payout multipliers.
2.  **The Grid:** 5 columns (reels) and 3 rows.
3.  **Spinning Animation:** 
    *   When "Spin" is clicked, we generate the final 5x3 result grid using RNG.
    *   We visually spin the reels by rapidly translating a column of images downwards using CSS `transform: translateY(...)`.
    *   We stagger the stopping of each reel (e.g., Reel 1 stops, then Reel 2, etc.) for a dramatic effect.
4.  **Win Calculation:** 
    *   Define active paylines (e.g., standard 10 paylines).
    *   After all reels stop, `winChecker.js` evaluates the final 5x3 grid against the paylines.
    *   If a win occurs, trigger the corresponding GIFs/animations from the `assets/animations/` folder over the winning symbols.
5.  **State Management:** Track user balance, current bet size, and win amounts.

## Development Phases
1.  **UI Setup:** Create the static HTML/CSS layout (background, empty 5x3 grid, spin button, balance display).
2.  **Symbol Mapping:** Create mock colored blocks or placeholder images to represent symbols before the custom "Vova" assets are fully integrated.
3.  **Spin Engine:** Implement the JavaScript logic to simulate spinning and land on random symbols.
4.  **Win Logic:** Implement the algorithm to check for matches along defined paylines and calculate payouts.
5.  **Asset Integration:** Replace placeholders with the actual custom PNGs and GIFs provided for "Book of Vova".
6.  **Polish:** Add staggered stops, blur effects during the spin, and win highlighting.

## Next Steps
1. Create the base files (`index.html`, `css/style.css`, `js/main.js`).
2. Set up the basic DOM structure for the 5x3 reels and the control panel.