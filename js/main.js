// main.js

document.addEventListener('DOMContentLoaded', () => {
    const soundManager = new SoundManager();
    const slotMachine = new SlotMachine(soundManager);
    const winChecker = new WinChecker();

    // Game state
    let balance = 1000;
    let bet = 10;
    const betOptions = [10, 20, 50, 100, 200, 500];
    let betIndex = 0;

    // DOM Elements
    const balanceDisplay = document.getElementById('balance-display');
    const betDisplay = document.getElementById('bet-display');
    const winDisplay = document.getElementById('win-display');
    
    const btnSpin = document.getElementById('btn-spin');
    const btnBetUp = document.getElementById('btn-bet-up');
    const btnBetDown = document.getElementById('btn-bet-down');
    const btnMute = document.getElementById('btn-mute');

    // Update UI functions
    function updateUI() {
        balanceDisplay.innerText = balance;
        betDisplay.innerText = bet;
    }

    function disableControls(disabled) {
        btnSpin.disabled = disabled;
        btnBetUp.disabled = disabled;
        btnBetDown.disabled = disabled;
    }

    // Event Listeners
    btnMute.addEventListener('click', () => {
        const isMuted = soundManager.toggleMute();
        btnMute.innerText = isMuted ? '🔇' : '🔊';
    });

    btnBetUp.addEventListener('click', () => {
        soundManager.play('buttonClick');
        if (betIndex < betOptions.length - 1) {
            betIndex++;
            bet = betOptions[betIndex];
            updateUI();
        }
    });

    btnBetDown.addEventListener('click', () => {
        soundManager.play('buttonClick');
        if (betIndex > 0) {
            betIndex--;
            bet = betOptions[betIndex];
            updateUI();
        }
    });

    btnSpin.addEventListener('click', async () => {
        soundManager.play('buttonClick');

        // Validation
        if (balance < bet) {
            alert("Insufficient balance!");
            return;
        }

        // Setup Spin
        soundManager.play('spin');
        balance -= bet;
        winDisplay.innerText = 0; // Reset win display
        updateUI();
        disableControls(true);
        clearWinAnimations();

        try {
            // Spin the reels
            const resultGrid = await slotMachine.spin();
            
            // Check for wins
            const winResult = winChecker.checkWins(resultGrid, bet);
            
            soundManager.stop('spin');

            if (winResult.totalWin > 0) {
                if (winResult.totalWin >= bet * 10) {
                    soundManager.play('bigWin');
                } else {
                    soundManager.play('win');
                }
                balance += winResult.totalWin;
                winDisplay.innerText = winResult.totalWin;
                updateUI();
                highlightWins(winResult.wins);
            }
        } catch (error) {
            soundManager.stop('spin');
            console.error("Spin error:", error);
        } finally {
            disableControls(false);
        }
    });

    function highlightWins(wins) {
        // Iterate through all winning combinations
        wins.forEach(win => {
            win.positions.forEach(pos => {
                // pos.col is reel index, pos.row is row index (0=top, 1=middle, 2=bottom)
                const reelEl = slotMachine.reels[pos.col].element;
                const stripEl = slotMachine.reels[pos.col].strip;
                
                // Because we animated by translating the strip down, the visible symbols 
                // are the LAST 3 symbols in the strip.
                // The children of the strip contain all symbols. We need to target the last 3.
                const symbolsInStrip = stripEl.children;
                const totalInStrip = symbolsInStrip.length;
                
                // Row 0 is the top visible symbol, which is totalInStrip - 3
                const targetElementIndex = totalInStrip - ROWS + pos.row;
                const targetElement = symbolsInStrip[targetElementIndex];
                
                if (targetElement) {
                    targetElement.classList.add('win-anim');
                }
            });
        });
    }

    function clearWinAnimations() {
        document.querySelectorAll('.win-anim').forEach(el => {
            el.classList.remove('win-anim');
        });
    }

    // Initial render
    updateUI();
});