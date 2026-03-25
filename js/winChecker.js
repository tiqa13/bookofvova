// winChecker.js

// Standard 10 paylines for a 5x3 slot machine
// Each array represents the row index (0, 1, or 2) across the 5 reels (columns)
const PAYLINES = [
    [1, 1, 1, 1, 1], // Line 1: Middle row
    [0, 0, 0, 0, 0], // Line 2: Top row
    [2, 2, 2, 2, 2], // Line 3: Bottom row
    [0, 1, 2, 1, 0], // Line 4: V shape starting top
    [2, 1, 0, 1, 2], // Line 5: Inverted V starting bottom
    [0, 0, 1, 2, 2], // Line 6: Step down
    [2, 2, 1, 0, 0], // Line 7: Step up
    [1, 2, 2, 2, 1], // Line 8: U shape bottom
    [1, 0, 0, 0, 1], // Line 9: U shape top
    [1, 0, 1, 2, 1]  // Line 10: Zigzag
];

// Base payouts for matching symbols (2, 3, 4, or 5 in a row)
// These multipliers will be multiplied by the 'bet per line'
const PAYOUTS = {
    '10': { 3: 5, 4: 25, 5: 100 },
    'J': { 3: 5, 4: 25, 5: 100 },
    'Q': { 3: 5, 4: 25, 5: 100 },
    'K': { 3: 5, 4: 40, 5: 150 },
    'A': { 3: 5, 4: 40, 5: 150 },
    'PHARAOH': { 2: 5, 3: 30, 4: 100, 5: 750 },
    'SCARAB': { 2: 5, 3: 30, 4: 100, 5: 750 },
    'EXPLORER': { 2: 10, 3: 100, 4: 1000, 5: 5000 },
    'BOOK': { 3: 20, 4: 200, 5: 2000 } // Scatter/Wild
};

class WinChecker {
    constructor() {
        this.wins = [];
    }

    checkWins(grid, currentBet) {
        this.wins = [];
        let totalWin = 0;
        
        // In this game, bet is total bet. So bet per line is total / 10 lines
        const betPerLine = currentBet / PAYLINES.length;

        // Check each payline
        PAYLINES.forEach((line, lineIndex) => {
            // Traverse the line from left to right (reel 0 to 4)
            // grid is [col][row]
            
            let matchCount = 1;
            let firstSymbol = grid[0][line[0]]; // Symbol on Reel 0
            
            // "Book" acts as a wild for regular symbols.
            // If the first symbol is a wild, we need to treat it differently (often takes the value of the next non-wild).
            // For simplicity in this version, let's treat it as its own symbol unless it substitutes.
            
            // Simplify wild logic: Book substitutes for any symbol to form the longest line
            let activeSymbol = firstSymbol;
            let hasWildStart = false;

            if (firstSymbol === 'BOOK') {
                 hasWildStart = true;
            }

            for (let col = 1; col < REELS; col++) {
                let currentSymbol = grid[col][line[col]];
                
                if (hasWildStart && currentSymbol !== 'BOOK' && activeSymbol === 'BOOK') {
                     // The line started with wild(s), now we found a real symbol. We adopt it as the target symbol.
                     activeSymbol = currentSymbol;
                }

                if (currentSymbol === activeSymbol || currentSymbol === 'BOOK' || activeSymbol === 'BOOK') {
                    matchCount++;
                } else {
                    break; // Chain broken
                }
            }

            // Check if matchCount yields a payout
            if (PAYOUTS[activeSymbol] && PAYOUTS[activeSymbol][matchCount]) {
                const winAmount = PAYOUTS[activeSymbol][matchCount] * betPerLine;
                totalWin += winAmount;
                
                this.wins.push({
                    lineIndex: lineIndex,
                    symbol: activeSymbol,
                    count: matchCount,
                    amount: winAmount,
                    positions: line.slice(0, matchCount).map((row, col) => ({ col, row }))
                });
            }
        });

        return { totalWin, wins: this.wins };
    }
}