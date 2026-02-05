class Sudoku {
    constructor() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.difficulty = 'medium';
    }

    generate(difficulty) {
        this.difficulty = difficulty;
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.fillBoard();
        this.solution = this.board.map(row => [...row]);
        this.removeNumbers();
        return this.board;
    }

    fillBoard() {
        const fill = (row, col) => {
            if (col === 9) { row++; col = 0; }
            if (row === 9) return true;
            const nums = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            for (let num of nums) {
                if (this.isValid(this.board, row, col, num)) {
                    this.board[row][col] = num;
                    if (fill(row, col + 1)) return true;
                    this.board[row][col] = 0;
                }
            }
            return false;
        };
        fill(0, 0);
    }

    isValid(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num) return false;
        }
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === num) return false;
            }
        }
        return true;
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    removeNumbers() {
        const counts = { 'easy': 32, 'medium': 45, 'hard': 54 };
        let count = counts[this.difficulty] || 45;
        while (count > 0) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            if (this.board[row][col] !== 0) {
                this.board[row][col] = 0;
                count--;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new Sudoku();
    const gridEl = document.getElementById('grid');
    const timerEl = document.getElementById('timer');
    const mistakesEl = document.getElementById('mistakes');
    const progressEl = document.getElementById('progress');
    const startModal = document.getElementById('start-modal');
    const startBtn = document.getElementById('start-game-btn');
    const rebootBtn = document.getElementById('reboot-btn');
    const themeBtn = document.getElementById('theme-toggle');

    let selectedCell = null;
    let timer = 0;
    let timerInterval;
    let mistakes = 0;

    function updateStats() {
        mistakesEl.textContent = mistakes;
        const totalToFill = 81 - game.board.flat().filter(x => x !== 0).length;
        const filled = Array.from(document.querySelectorAll('.cell:not(.given)')).filter(c => c.textContent !== '' && !c.classList.contains('wrong')).length;
        const progress = Math.round((filled / totalToFill) * 100) || 0;
        progressEl.textContent = `${progress}%`;
    }

    function startTimer() {
        clearInterval(timerInterval);
        timer = 0;
        timerInterval = setInterval(() => {
            timer++;
            const mins = Math.floor(timer / 60).toString().padStart(2, '0');
            const secs = (timer % 60).toString().padStart(2, '0');
            timerEl.textContent = `${mins}:${secs}`;
        }, 1000);
    }

    function initGame(diff = 'medium') {
        const board = game.generate(diff);
        document.getElementById('difficulty-text').textContent = diff.toUpperCase();
        gridEl.innerHTML = '';
        mistakes = 0;
        updateStats();

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                if (board[r][c] !== 0) {
                    cell.textContent = board[r][c];
                    cell.classList.add('given');
                }
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.addEventListener('mousedown', () => selectCell(cell));
                gridEl.appendChild(cell);
            }
        }
        startTimer();
    }

    function selectCell(cell) {
        if (selectedCell) selectedCell.classList.remove('selected');
        selectedCell = cell;
        selectedCell.classList.add('selected');

        const row = cell.dataset.row;
        const col = cell.dataset.col;
        const num = cell.textContent;

        document.querySelectorAll('.cell').forEach(c => {
            c.classList.remove('highlighted', 'same-number');
            if (c.dataset.row === row || c.dataset.col === col) {
                c.classList.add('highlighted');
            }
            if (num && c.textContent === num) {
                c.classList.add('same-number');
            }
        });
    }

    function handleInput(num) {
        if (!selectedCell || selectedCell.classList.contains('given')) return;

        const r = parseInt(selectedCell.dataset.row);
        const c = parseInt(selectedCell.dataset.col);

        if (num === 0) {
            selectedCell.textContent = '';
            selectedCell.classList.remove('wrong', 'correct');
            updateStats();
            return;
        }

        selectedCell.textContent = num;
        if (num === game.solution[r][c]) {
            selectedCell.classList.add('correct');
            selectedCell.classList.remove('wrong');
            selectCell(selectedCell);
            checkWin();
        } else {
            selectedCell.classList.add('wrong');
            selectedCell.classList.remove('correct');
            mistakes++;
            if (mistakes >= 5) {
                setTimeout(() => {
                    if (confirm("CRITICAL MISTAKES. Reboot grid?")) initGame(game.difficulty);
                }, 100);
            }
        }
        updateStats();
    }

    function checkWin() {
        const cells = Array.from(document.querySelectorAll('.cell'));
        const isWin = cells.every(c => {
            const r = parseInt(c.dataset.row);
            const col = parseInt(c.dataset.col);
            return parseInt(c.textContent) === game.solution[r][col];
        });

        if (isWin) {
            clearInterval(timerInterval);
            setTimeout(() => alert(`🏆 GRID CLEARED! Time: ${timerEl.textContent}`), 200);
        }
    }

    // Modal behavior
    startBtn.addEventListener('click', () => {
        const diff = document.getElementById('difficulty-text').textContent.toLowerCase();
        startModal.classList.add('hidden');
        initGame(diff);
    });

    rebootBtn.addEventListener('click', () => {
        initGame(game.difficulty);
    });

    // Theme Toggle
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const icon = themeBtn.querySelector('i');
        if (document.body.classList.contains('light-mode')) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    });

    // Number Pad
    document.querySelectorAll('.num-btn:not(.erase):not(#reboot-btn):not(#start-game-btn)').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = parseInt(btn.textContent);
            if (!isNaN(val)) handleInput(val);
        });
    });

    document.querySelector('.num-btn.erase').addEventListener('click', () => handleInput(0));

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key >= 1 && e.key <= 9) handleInput(parseInt(e.key));
        if (e.key === 'Backspace' || e.key === 'Delete') handleInput(0);

        if (selectedCell && e.key.startsWith('Arrow')) {
            let r = parseInt(selectedCell.dataset.row);
            let c = parseInt(selectedCell.dataset.col);
            if (e.key === 'ArrowUp') r = (r - 1 + 9) % 9;
            if (e.key === 'ArrowDown') r = (r + 1) % 9;
            if (e.key === 'ArrowLeft') c = (c - 1 + 9) % 9;
            if (e.key === 'ArrowRight') c = (c + 1) % 9;
            selectCell(document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`));
        }
    });

    window.initSudoku = initGame;
});
