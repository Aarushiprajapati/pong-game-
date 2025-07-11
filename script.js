const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const BALL_SIZE = 16;
const PADDLE_MARGIN = 18;
const PLAYER_COLOR = '#00FFAA';
const AI_COLOR = '#FF3377';
const BALL_COLOR = '#FFF';
const NET_COLOR = '#FFF4';
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Paddle positions
let playerY = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
let aiY = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;

// Ball position and speed
let ballX = CANVAS_WIDTH / 2 - BALL_SIZE / 2;
let ballY = CANVAS_HEIGHT / 2 - BALL_SIZE / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

// Mouse control setup
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp paddle inside canvas
    if (playerY < 0) playerY = 0;
    if (playerY > CANVAS_HEIGHT - PADDLE_HEIGHT) playerY = CANVAS_HEIGHT - PADDLE_HEIGHT;
});

// Draw net
function drawNet() {
    ctx.fillStyle = NET_COLOR;
    const netWidth = 4, netHeight = 20;
    for (let y = 0; y < CANVAS_HEIGHT; y += netHeight * 2) {
        ctx.fillRect(CANVAS_WIDTH/2 - netWidth/2, y, netWidth, netHeight);
    }
}

// Draw paddles and ball
function draw() {
    // Clear
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawNet();

    // Player paddle
    ctx.fillStyle = PLAYER_COLOR;
    ctx.fillRect(PADDLE_MARGIN, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // AI paddle
    ctx.fillStyle = AI_COLOR;
    ctx.fillRect(CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    ctx.fillStyle = BALL_COLOR;
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

// Handle collisions and move everything
function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top/bottom wall collision
    if (ballY < 0) {
        ballY = 0;
        ballSpeedY = -ballSpeedY;
    }
    if (ballY + BALL_SIZE > CANVAS_HEIGHT) {
        ballY = CANVAS_HEIGHT - BALL_SIZE;
        ballSpeedY = -ballSpeedY;
    }

    // Player paddle collision
    if (
        ballX < PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY + BALL_SIZE > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballX = PADDLE_MARGIN + PADDLE_WIDTH;
        ballSpeedX = -ballSpeedX;

        // Add a bit of "spin" depending on hit location
        let hitPoint = (ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2);
        ballSpeedY = hitPoint * 0.18;
    }

    // AI paddle collision
    if (
        ballX + BALL_SIZE > CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY + BALL_SIZE > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballX = CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE;
        ballSpeedX = -ballSpeedX;

        let hitPoint = (ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2);
        ballSpeedY = hitPoint * 0.18;
    }

    // Left or right wall (reset ball)
    if (ballX < 0 || ballX + BALL_SIZE > CANVAS_WIDTH) {
        resetBall();
    }

    // AI paddle movement (basic)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY + BALL_SIZE / 2 - 8) {
        aiY += Math.min(5, (ballY + BALL_SIZE/2 - aiCenter));
    } else if (aiCenter > ballY + BALL_SIZE / 2 + 8) {
        aiY -= Math.min(5, (aiCenter - (ballY + BALL_SIZE/2)));
    }
    // Clamp AI paddle
    if (aiY < 0) aiY = 0;
    if (aiY > CANVAS_HEIGHT - PADDLE_HEIGHT) aiY = CANVAS_HEIGHT - PADDLE_HEIGHT;
}

function resetBall() {
    ballX = CANVAS_WIDTH / 2 - BALL_SIZE / 2;
    ballY = CANVAS_HEIGHT / 2 - BALL_SIZE / 2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();