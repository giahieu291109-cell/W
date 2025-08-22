let balance = 1000000;
let currentBet = 0;
let betChoice = null;
let isRolling = false;

const balanceLabel = document.getElementById('balance-label');
const totalBetLabel = document.getElementById('total-bet-label');
const gameMessage = document.getElementById('game-message');
const diceDisplay = document.getElementById('dice-display');
const taiSection = document.querySelector('.tai-section');
const xiuSection = document.querySelector('.xiu-section');
const betBtn = document.getElementById('bet-btn');
const cancelBtn = document.getElementById('cancel-btn');
const chips = document.querySelectorAll('.chip');

function updateDisplay() {
    balanceLabel.textContent = `Số dư: ${balance.toLocaleString('vi-VN')} VNĐ`;
    totalBetLabel.textContent = `Tổng cược: ${currentBet.toLocaleString('vi-VN')} VNĐ`;
}

function selectBetArea(choice) {
    if (isRolling || currentBet === 0) return;

    taiSection.classList.remove('selected');
    xiuSection.classList.remove('selected');
    
    if (choice === 'tai') {
        taiSection.classList.add('selected');
        betChoice = 'tai';
    } else {
        xiuSection.classList.add('selected');
        betChoice = 'xiu';
    }
}

function resetGame() {
    currentBet = 0;
    betChoice = null;
    isRolling = false;
    taiSection.classList.remove('selected');
    xiuSection.classList.remove('selected');
    betBtn.disabled = false;
    cancelBtn.disabled = false;
    gameMessage.textContent = 'Chọn mệnh giá và đặt cược!';
    diceDisplay.textContent = '🎲';
    diceDisplay.classList.remove('rolling');
    updateDisplay();
}

function rollDice() {
    return new Promise(resolve => {
        isRolling = true;
        betBtn.disabled = true;
        cancelBtn.disabled = true;
        gameMessage.textContent = 'Đang lắc xúc xắc...';
        diceDisplay.classList.add('rolling');

        let rollCount = 0;
        const interval = setInterval(() => {
            const dice1 = Math.floor(Math.random() * 6) + 1;
            const dice2 = Math.floor(Math.random() * 6) + 1;
            const dice3 = Math.floor(Math.random() * 6) + 1;
            diceDisplay.textContent = `${dice1} ${dice2} ${dice3}`;
            
            rollCount++;
            if (rollCount >= 20) {
                clearInterval(interval);
                diceDisplay.classList.remove('rolling');
                resolve({ dice1, dice2, dice3 });
            }
        }, 100);
    });
}

function checkResult({ dice1, dice2, dice3 }) {
    const total = dice1 + dice2 + dice3;

    if (dice1 === dice2 && dice2 === dice3) {
        gameMessage.textContent = `Kết quả: Bão (Tổng ${total}). Bạn thua!`;
        balance -= currentBet;
    } else if (total >= 11) {
        if (betChoice === 'tai') {
            gameMessage.textContent = `Kết quả: Tài (Tổng ${total}). Bạn thắng!`;
            balance += currentBet;
        } else {
            gameMessage.textContent = `Kết quả: Tài (Tổng ${total}). Bạn thua!`;
            balance -= currentBet;
        }
    } else {
        if (betChoice === 'xiu') {
            gameMessage.textContent = `Kết quả: Xỉu (Tổng ${total}). Bạn thắng!`;
            balance += currentBet;
        } else {
            gameMessage.textContent = `Kết quả: Xỉu (Tổng ${total}). Bạn thua!`;
            balance -= currentBet;
        }
    }

    if (balance <= 0) {
        alert("Bạn đã hết tiền! Game Over.");
        balance = 1000000;
    }
    updateDisplay();
    setTimeout(resetGame, 3000);
}

betBtn.addEventListener('click', () => {
    if (currentBet === 0 || betChoice === null) {
        alert('Vui lòng chọn mệnh giá và cửa cược.');
        return;
    }
    rollDice().then(result => checkResult(result));
});

cancelBtn.addEventListener('click', resetGame);

chips.forEach(chip => {
    chip.addEventListener('click', () => {
        if (isRolling) return;
        const value = parseInt(chip.dataset.value);
        if (balance >= currentBet + value) {
            currentBet += value;
            updateDisplay();
        } else {
            alert('Số tiền cược vượt quá số dư!');
        }
    });
});

updateDisplay();