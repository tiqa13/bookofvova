# AI Agent Guidelines: Book of Vova

Welcome! This document provides technical context, architecture rules, and coding guidelines for any AI agent or LLM interacting with the **Book of Vova** repository.

## 1. Project Overview
"Book of Vova" is a custom 5x3 slot machine web game built entirely without heavy frameworks. It simulates the mechanics of a classic slot machine ("Book of Ra" style) using an Egyptian/Explorer theme. 

## 2. Tech Stack & Rules
*   **HTML5:** Pure HTML, structured semantically.
*   **CSS3:** No preprocessors (no Sass/Less). Uses CSS variables, Grid/Flexbox, and native CSS transitions/keyframes for animations (like reel spins).
*   **Vanilla JavaScript (ES6+):** No frontend frameworks (no React, Vue, Angular). No bundlers (Webpack, Vite) unless explicitly requested. Code should run natively in modern browsers.
*   **Libraries:** External libraries are kept to an absolute minimum (e.g., `canvas-confetti` for win effects).

## 3. Architecture & File Structure
*   **`index.html`:** The main layout, referencing the CSS and JS files directly.
*   **`css/style.css`:** All styling. Reels are animated by rapidly translating a column of images downwards (`transform: translateY`).
*   **`js/main.js`:** The primary UI controller. Binds DOM events, handles game state (balance, bet, win amounts), and triggers sounds/animations.
*   **`js/slotLogic.js`:** Core mechanics. Contains the `SlotMachine` class. Manages the 5x3 grid, random number generation (RNG) with weighted probabilities, and reel DOM manipulation.
*   **`js/winChecker.js`:** Payline evaluation. Contains the `WinChecker` class. Calculates wins across 10 defined paylines based on the current grid state.
*   **`js/soundManager.js`:** Audio handling (muting, playing win/spin sounds).
*   **`assets/`:** Contains all custom `images/` (10, J, Q, K, A, Pharaoh, Scarab, Explorer, Book) and `sounds/`.

## 4. Coding Guidelines
*   **Class-Based OOP:** Stick to the established Object-Oriented patterns (e.g., `class SlotMachine`, `class WinChecker`). Keep logic decoupled from UI where possible.
*   **State Management:** Game state (`balance`, `bet`, `win`) is currently managed globally in `main.js`. Do not introduce complex state management libraries like Redux.
*   **Reel Animations:** 
    *   Do not use Canvas for reels. The game uses a DOM-based approach where a long strip of `div`s with background images is translated using CSS `translateY()`.
    *   Animation timings should rely on CSS transitions to ensure smooth performance.
*   **Win Logic:**
    *   The game uses a 10-payline system.
    *   The "BOOK" symbol acts as a Wild (substitutes for others).
*   **Responsiveness:** Ensure any UI changes scale well on both desktop and mobile devices.
*   **Comments & Clarity:** Use clear, descriptive variable names. Add inline comments explaining complex RNG or win-check algorithms.

## 5. Agent Workflow
1.  **Analyze Context:** Always read `plans/plan.md`, `js/slotLogic.js`, and `js/winChecker.js` if modifying core game loop logic.
2.  **Respect Scope:** Do not over-engineer. The goal is a lightweight, performant Vanilla JS game.
3.  **UI Updates:** Any DOM updates (balance, highlighting winning lines) should be handled through functions in `main.js` (e.g., `updateUI`, `highlightWins`), not deeply embedded within the logic classes.