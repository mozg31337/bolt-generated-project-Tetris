    const canvas = document.getElementById('tetris');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');

    // Game variables
    let board = [];
    let currentPiece = null;
    let score = 0;

    // Tetromino shapes
    const SHAPES = [
      [[1, 1, 1, 1]], // I
      [[1, 1], [1, 1]], // O
      [[1, 1, 1], [0, 1, 0]], // T
      [[1, 1, 1], [1, 0, 0]], // L
      [[1, 1, 1], [0, 0, 1]], // J
      [[1, 1, 0], [0, 1, 1]], // S
      [[0, 1, 1], [1, 1, 0]]  // Z
    ];

    function initGame() {
      board = [];
      currentPiece = null;
      score = 0;
      createBoard();
      currentPiece = createPiece();
      gameLoop();
    }

    function createBoard() {
      for (let y = 0; y < 20; y++) {
        board[y] = [];
        for (let x = 0; x < 10; x++) {
          board[y][x] = 0;
        }
      }
    }

    function drawBoard() {
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
          if (board[y][x]) {
            ctx.fillStyle = '#000';
            ctx.fillRect(x * 30, y * 30, 28, 28);
          }
        }
      }
    }

    function createPiece() {
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      return {
        shape,
        x: Math.floor(10 / 2) - Math.floor(shape[0].length / 2),
        y: 0
      };
    }

    function drawPiece() {
      ctx.fillStyle = '#000';
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            ctx.fillRect(
              (currentPiece.x + x) * 30,
              (currentPiece.y + y) * 30,
              28,
              28
            );
          }
        });
      });
    }

    function moveDown() {
      currentPiece.y++;
      if (!canMove(currentPiece, 1)) {
        currentPiece.y--;
        mergePiece();
        checkLines();
        if (!canMove(currentPiece, 0)) {
          score = 0;
          resetGame();
        }
      }
    }

    function canMove(piece, moveY) {
      return piece.shape.every((row, y) => {
        return row.every((value, x) => {
          let newX = piece.x + x;
          let newY = piece.y + y + moveY;
          if (newX < 0 || newX >= 10 || newY < 0 || newY >= 20) return false;
          return !board[newY][newX];
        });
      });
    }

    function mergePiece() {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            board[currentPiece.y + y][currentPiece.x + x] = 1;
          }
        });
      });
    }

    function checkLines() {
      let linesCleared = 0;
      for (let y = 0; y < 20; y++) {
        if (board[y].every(cell => cell)) {
          board.splice(y, 1);
          board.push(Array(10).fill(0));
          linesCleared++;
          y--;
        }
      }
      score += linesCleared * 100;
      scoreElement.textContent = score;
    }

    function resetGame() {
      createBoard();
      currentPiece = createPiece();
    }

    function moveHorizontal(moveX) {
      currentPiece.x += moveX;
      if (!canMove(currentPiece, 0)) {
        currentPiece.x -= moveX;
      }
    }

    function rotate() {
      const rotated = currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map(row => row[i]).reverse()
      );
      const previousShape = currentPiece.shape;
      currentPiece.shape = rotated;
      if (!canMove(currentPiece, 0)) {
        currentPiece.shape = previousShape;
      }
    }

    function gameLoop() {
      drawBoard();
      moveDown();
      drawPiece();
      requestAnimationFrame(gameLoop);
    }

    // Controls
    document.addEventListener('keydown', event => {
      switch (event.key) {
        case 'ArrowLeft':
          moveHorizontal(-1);
          break;
        case 'ArrowRight':
          moveHorizontal(1);
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'q':
          rotate();
          break;
        case 'w':
          rotate();
          rotate();
          break;
      }
    });

    // Start game
    initGame();
