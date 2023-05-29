document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth - 20; 
  canvas.height = window.innerHeight - 20; 

  const paddleWidth = 0.1 * canvas.width; 
  const paddleHeight = 0.02 * canvas.height; 
  const paddle = {
    x: canvas.width / 2 - paddleWidth / 2,
    y: canvas.height - paddleHeight - 10,
    width: paddleWidth,
    height: paddleHeight,
    dx: 0
  };
  
  
  
  const ballRadius = 0.01 * Math.min(canvas.width, canvas.height); 
  const ball = {
    x: canvas.width / 2,
    y: canvas.height - paddleHeight - ballRadius - 10,
    radius: ballRadius,
    speed: 0.003 * canvas.width, 
    dx: 0.003 * canvas.width,
    dy: -0.003 * canvas.width
  };

  let bricks = [];
  const brickRowCount = 3;
  const brickColumnCount = 5;
  const brickWidth = 0.1 * canvas.width; 
  const brickHeight = 0.02 * canvas.height; 
  const brickPadding = 10;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 30;

  function createBricks() {
    bricks = [];
    const halfScreenWidth = canvas.width / 2;
    const randomOffset = Math.random() * (halfScreenWidth - brickColumnCount * (brickWidth + brickPadding));
    const randomXStart = halfScreenWidth - randomOffset;

    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        const brickX = randomXStart + c * (brickWidth + brickPadding);
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r] = { x: brickX, y: brickY, status: 1 };
      }
    }
  }

  function resetGame() {
    paddle.x = canvas.width / 2 - paddle.width / 2;
    ball.x = canvas.width / 2;
    ball.y = canvas.height - paddle.height - ball.radius - 10;
    ball.speed = 0.003 * canvas.width; 
    ball.dx = 0.003 * canvas.width;
    ball.dy = -0.003 * canvas.width;
    createBricks();
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.closePath();
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.closePath();
  }

  function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          const brickX = bricks[c][r].x;
          const brickY = bricks[c][r].y;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#000";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function movePaddle() {
    paddle.x += paddle.dx;

    if (paddle.x < 0) {
      paddle.x = 0;
    } else if (paddle.x + paddle.width > canvas.width) {
      paddle.x = canvas.width - paddle.width;
    }
  }

  function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.dx = -ball.dx;
    }

    if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
    }

    if (
      ball.y + ball.radius > canvas.height - paddle.height &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.width
    ) {
      ball.dy = -ball.dy;
    }

    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const brick = bricks[c][r];
        if (brick.status === 1) {
          if (
            ball.x > brick.x &&
            ball.x < brick.x + brickWidth &&
            ball.y > brick.y &&
            ball.y < brick.y + brickHeight
          ) {
            ball.dy = -ball.dy;
            brick.status = 0;
          }
        }
      }
    }

    if (ball.y + ball.radius > canvas.height) {
      showGameOverPopup();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();
    drawBricks();
  }

  function showGameOverPopup() {
    const playAgain = confirm("Game over! Play again?");
    if (playAgain) {
      resetGame();
    } else {
      
    }
  }

  createBricks();
  draw();

  document.addEventListener("keydown", function(e) {
    if (e.key === "ArrowLeft") {
      paddle.dx = -5;
    } else if (e.key === "ArrowRight") {
      paddle.dx = 5;
    }
  });

  document.addEventListener("keyup", function(e) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      paddle.dx = 0;
    }
  });

  function animate() {
    requestAnimationFrame(animate);
    movePaddle();
    moveBall();
    draw();
  }

  animate();
});