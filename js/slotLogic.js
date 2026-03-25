// slotLogic.js

const REELS = 5;
const ROWS = 3;

// Setup for custom images
// Weight: higher = more common
const SYMBOLS = {
    '10': { id: 0, weight: 8, img: 'assets/images/10.jpeg', name: '10' },
    'J': { id: 1, weight: 8, img: 'assets/images/j.jpeg', name: 'J' },
    'Q': { id: 2, weight: 7, img: 'assets/images/q.jpeg', name: 'Q' },
    'K': { id: 3, weight: 7, img: 'assets/images/k.jpeg', name: 'K' },
    'A': { id: 4, weight: 6, img: 'assets/images/a.jpeg', name: 'A' },
    'PHARAOH': { id: 5, weight: 5, img: 'assets/images/vova.png', name: 'Pharaoh' },
    'SCARAB': { id: 6, weight: 5, img: 'assets/images/Scarab.jpeg', name: 'Scarab' },
    'EXPLORER': { id: 7, weight: 4, img: 'assets/images/Explorer.jpeg', name: 'Explorer' },
    'BOOK': { id: 8, weight: 8, img: 'assets/images/book.jpeg', name: 'Book', isWild: true, isScatter: true } // The "Book of Vova"
};

const SYMBOL_KEYS = Object.keys(SYMBOLS);
const SYMBOL_SIZE = 100; // Match var(--symbol-size) from css

class SlotMachine {
    constructor(soundManager) {
        this.soundManager = soundManager;
        this.reels = [];
        this.isSpinning = false;
        this.currentGrid = Array.from({ length: REELS }, () => Array(ROWS).fill(null));
        this.initDOM();
    }

    initDOM() {
        const container = document.getElementById('reels-container');
        container.innerHTML = ''; // Clear if any

        for (let i = 0; i < REELS; i++) {
            const reelEl = document.createElement('div');
            reelEl.classList.add('reel');
            reelEl.id = `reel-${i}`;
            
            const stripEl = document.createElement('div');
            stripEl.classList.add('symbols-strip');
            reelEl.appendChild(stripEl);

            container.appendChild(reelEl);
            
            // Generate initial random symbols for this reel
            this.reels.push({
                element: reelEl,
                strip: stripEl,
                symbols: this.generateRandomSymbols(ROWS + 1) // +1 for seamless looping buffer later
            });

            this.renderReel(i);
        }
        
        // Populate current grid state
        this.updateCurrentGrid();
    }

    getRandomSymbol() {
        // Simple weighted random selection
        const totalWeight = Object.values(SYMBOLS).reduce((sum, sym) => sum + sym.weight, 0);
        let randomNum = Math.random() * totalWeight;
        
        for (const key of SYMBOL_KEYS) {
            randomNum -= SYMBOLS[key].weight;
            if (randomNum <= 0) {
                return key;
            }
        }
        return SYMBOL_KEYS[0]; // Fallback
    }

    generateRandomSymbols(count) {
        return Array.from({ length: count }, () => this.getRandomSymbol());
    }

    renderReel(reelIndex) {
        const strip = this.reels[reelIndex].strip;
        strip.innerHTML = ''; // clear

        // In a real slot machine, a strip has many symbols. 
        // For a simple CSS animation spin, we'll append a long list of random symbols.
        this.reels[reelIndex].symbols.forEach(symbolKey => {
            const symEl = document.createElement('div');
            symEl.classList.add('symbol');
            
            // Set background image
            symEl.style.backgroundImage = `url(${SYMBOLS[symbolKey].img})`;
            symEl.dataset.symbol = symbolKey;
            
            // Optional: remove inner text
            symEl.innerText = '';

            strip.appendChild(symEl);
        });
    }

    updateCurrentGrid() {
        // Extract the visible 3 symbols from the bottom of the strip (which is where they stop)
        for (let col = 0; col < REELS; col++) {
            const symbols = this.reels[col].symbols;
            const visibleSymbols = symbols.slice(-ROWS); // Get the last 3 symbols
            for (let row = 0; row < ROWS; row++) {
                this.currentGrid[col][row] = visibleSymbols[row];
            }
        }
    }

    async spin() {
        if (this.isSpinning) return Promise.reject("Already spinning");
        this.isSpinning = true;

        const spinPromises = [];
        
        // How many symbols to add for the spin effect
        const spinLengthBase = 20;

        for (let i = 0; i < REELS; i++) {
            const strip = this.reels[i].strip;
            
            // Reset transition and transform to top instantly
            strip.style.transition = 'none';
            strip.style.transform = `translateY(0px)`;
            
            // Generate new symbols for the spin: 
            // Keep the previous visible ones at the top, add random ones in middle, and the final 3 at the bottom
            const oldVisible = this.reels[i].symbols.slice(-ROWS);
            const spinLength = spinLengthBase + (i * 10); // Staggered lengths
            const newRandoms = this.generateRandomSymbols(spinLength);
            const finalSymbols = this.generateRandomSymbols(ROWS); // The outcome
            
            this.reels[i].symbols = [...oldVisible, ...newRandoms, ...finalSymbols];
            this.renderReel(i);

            // Calculate distance to move: total symbols minus the initial buffer (the old visible ones)
            // Minus ROWS to stop at the last 3 symbols.
            const totalSymbols = this.reels[i].symbols.length;
            const distanceToMove = -((totalSymbols - ROWS) * SYMBOL_SIZE);

            // Create promise for this reel's animation
            const p = new Promise(resolve => {
                // Small timeout to allow CSS to register the 'none' transition before we apply the spin
                setTimeout(() => {
                    // Apply staggered duration
                    const duration = 1.5 + (i * 0.5); 
                    strip.style.transition = `transform ${duration}s cubic-bezier(0.1, 0.7, 0.1, 1)`;
                    strip.style.transform = `translateY(${distanceToMove}px)`;

                    // Wait for animation to finish
                    setTimeout(() => {
                        if (this.soundManager) {
                            this.soundManager.play('reelStop');
                        }
                        resolve();
                    }, duration * 1000);
                }, 50);
            });

            spinPromises.push(p);
        }

        // Wait for all reels to finish spinning
        await Promise.all(spinPromises);
        
        this.updateCurrentGrid();
        this.isSpinning = false;
        
        return this.currentGrid;
    }
}