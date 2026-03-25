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
                triggerWinEffects();
            }
        } catch (error) {
            soundManager.stop('spin');
            console.error("Spin error:", error);
        } finally {
            disableControls(false);
        }
    });

    function triggerWinEffects() {
        // Detect if mobile to optimize particle count
        const isMobile = window.innerWidth < 768;
        const particleMultiplier = isMobile ? 0.4 : 1;

        // Confetti burst
        confetti({
            particleCount: Math.floor(100 * particleMultiplier),
            spread: 70,
            origin: { y: 0.6 },
            zIndex: 9999
        });

        // Fireworks
        const duration = 2 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const baseParticleCount = 50 * (timeLeft / duration);
            const particleCount = Math.floor(baseParticleCount * particleMultiplier);
            
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, isMobile ? 400 : 250);
    }

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