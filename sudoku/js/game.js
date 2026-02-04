class Sudoku {
    constructor() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.difficulty = 'easy'; // easy, medium, hard
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
            if (col === 9) {
                row++;
                col = 0;
            }
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
        let count = {
            'easy': 30,
            'medium': 45,
            'hard': 55
        }[this.difficulty];

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

// UI Controller
document.addEventListener('DOMContentLoaded', () => {
    const game = new Sudoku();
    const gridEl = document.getElementById('grid');
    const timerEl = document.getElementById('timer');
    let selectedCell = null;
    let timer = 0;
    let timerInterval;

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

    function initGame(diff = 'easy') {
        const board = game.generate(diff);
        gridEl.innerHTML = '';
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
                cell.addEventListener('click', () => selectCell(cell));
                gridEl.appendChild(cell);
            }
        }
        startTimer();
    }

    function selectCell(cell) {
        if (selectedCell) selectedCell.classList.remove('selected');
        selectedCell = cell;
        selectedCell.classList.add('selected');

        // Highlight logic
        document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlighted'));
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        document.querySelectorAll(`.cell[data-row="${row}"], .cell[data-col="${col}"]`).forEach(c => c.classList.add('highlighted'));
    }

    function handleInput(num) {
        if (!selectedCell || selectedCell.classList.contains('given')) return;

        const r = selectedCell.dataset.row;
        const c = selectedCell.dataset.col;

        if (num === 0) {
            selectedCell.textContent = '';
            selectedCell.classList.remove('wrong', 'correct');
            return;
        }

        selectedCell.textContent = num;
        if (num === game.solution[r][c]) {
            selectedCell.classList.add('correct');
            selectedCell.classList.remove('wrong');
            checkWin();
        } else {
            selectedCell.classList.add('wrong');
            selectedCell.classList.remove('correct');
        }
    }

    function checkWin() {
        const cells = document.querySelectorAll('.cell');
        const isWin = Array.from(cells).every(c => {
            const r = c.dataset.row;
            const col = c.dataset.col;
            return parseInt(c.textContent) === game.solution[r][col];
        });

        if (isWin) {
            clearInterval(timerInterval);
            alert(`🎉 Congratulations! You solved it in ${timerEl.textContent}!`);
        }
    }

    // Controls
    document.querySelectorAll('.num-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.classList.contains('erase') ? 0 : parseInt(btn.textContent);
            handleInput(val);
        });
    });

    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            initGame(btn.dataset.diff);
        });
    });

    document.getElementById('new-game').addEventListener('click', () => {
        const activeDiff = document.querySelector('.diff-btn.active').dataset.diff;
        initGame(activeDiff);
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key >= 1 && e.key <= 9) handleInput(parseInt(e.key));
        if (e.key === 'Backspace' || e.key === 'Delete') handleInput(0);
    });

    initGame();
});
