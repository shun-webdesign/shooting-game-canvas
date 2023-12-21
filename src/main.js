let canvas, context;
let width, height, cx, cy;
const stars = new Map();
const beams = new Map();
let enemies = new Map();
let [vx, vy] = [0, 0];
let startTime, score = 0;
let status = "ready";

// キャンバスサイズをウィンドウサイズに合わせて設定
function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    [cx, cy] = [width / 2, height / 2];

    if (canvas) {
        canvas.width = width;
        canvas.height = height;
    }
}

// ビームクラス
class Beam {
    constructor(n) {
        this.x = n * width;
        this.y = height;
        // ビームの移動方向
        this.dx = (cx - this.x) / 19;
        this.dy = -cy / 19;
        this.status = "alive";
    }

    update(vx, vy) {
        this.x += this.dx - vx / 2;
        this.y += this.dy - vy / 2;
        // ビームの移動を小さくする
        this.dx *= 0.95;
        this.dy *= 0.95;
        // 黄色の直線でビームを描く
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(this.x + this.dx, this.y + this.dy);
        context.stroke();
        // 移動が1未満ならビームを消す
        if (Math.abs(this.dx) < 1) this.status = "Dead";
    }
}

class Enemy {
    constructor() {
        this.x = Math.random() * (width - 100) + 50;
        this.y = Math.random() * (height - 100) + 50;
        this.vx = Math.random() * Math.sign(cx - this.x);
        this.vy = Math.random() * Math.sign(cy - this.y);
        this.size = 0;
        this.delay = 10;
        this.status = "alive";
    }

    update(vx, vy) {
        this.x += this.vx - vx;
        this.y += this.vy - vy;
        if (this.status == "alive") {
            // エイリアン
            drawText("0x1F47E", this.x, this.y, this.size, "center");
            this.size += 0.2;
            if (this.size > 100) {
                [this.size, this.delay] = [this.size + 5, this.delay - 1];
            }
        } else if (this.status == "explosion") {
            // 爆発
            drawText("0x1F4A5", this.x, this.y, this.size, "center");
            this.size += 5;
            this.delay--;
        }
        if (this.delay == 0) this.status = "Dead"; // 遅延表示カウントが0になったら敵を消す
    }
}

// 星クラス
class Star {
    constructor() {
        this.x = Math.random() * width * 2 - cx;
        this.y = Math.random() * height * 2 - cy;
        this.speed = Math.random() * 2 + 0.1;
    }
    update(vx, vy) {
        this.x -= vx * this.speed;
        this.y -= vy * this.speed;
        if ((this.x < -cx) || (this.x > width + cx)) this.x = width - this.x;
        if ((this.y < -cy) || (this.y > height + cy)) this.y = height - this.y;
        context.fillStyle = "white";
        context.fillRect(this.x, this.y, this.speed, this.speed);
    }
}

// 初期化関数
const init = () => {
    canvas = document.getElementById("stage");
    context = canvas.getContext("2d");
    context.lineWidth = 2;

    // キャンバスのサイズを設定
    resizeCanvas();

    // リサイズイベントの登録
    window.addEventListener('resize', resizeCanvas);

    // マウスイベントの登録
    canvas.addEventListener("mouseleave", () => [vx, vy] = [0, 0]);
    canvas.addEventListener("mousemove", event => {
        [vx, vy] = [(event.offsetX - cx) / 50, (event.offsetY - cy) / 50];
    });
    canvas.addEventListener("click", () => { if (status != "Play") startGame(); });

    // 星の作成
    for (let i = 0; i < 200; i++) stars.set(i, new Star());

    // ゲームの更新ループを開始
    update();
}

// ゲーム開始関数
const startGame = () => {
    enemies.clear();
    [startTime, score, status] = [Date.now(), 0, "Play"];
}

// 更新関数
const update = () => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);
    stars.forEach(star => star.update(vx, vy));

    let time = 600 - Math.floor((Date.now() - startTime) / 100);
    if (time <= 0) status = "Retry";

    let fire = false;
    if ((Math.floor(time) % 20 == 0) && (!enemies.has(time))) {
        enemies.set(time, new Enemy());
        enemies = new Map([...enemies].sort((a, b) => a[0] - b[0]));
    }
    enemies.forEach((enemy, i) => {
        enemy.update(vx, vy);
        if (Math.hypot(enemy.x - cx, enemy.y - cy) < enemy.size / 3) fire = true;
        if (enemy.status == "Dead") enemies.delete(i);
    });

    if ((fire) && (status == "Play")) beams.set(time, new Beam(time % 2));
    beams.forEach((beam, i) => {
        beam.update(vx, vy);
        if (beam.status == "Dead") beams.delete(i);
        enemies.forEach(enemy => {
            if (Math.hypot(beam.x - enemy.x, beam.y - enemy.y) < enemy.size / 3) {
                if (enemy.status == "alive") {
                    score += 10;
                    enemy.status = "explosion";
                }
            }
        });
    });

    context.strokeStyle = "cyan";
    if ((fire) && (status == "play")) context.strokeStyle = "red";
    context.setLineDash([10, 20, 20, 20, 20, 20, 20, 20, 20, 10]);
    context.strokeRect(cx - 20, cy - 20, 40, 40);

    if (status != "Play") {
        drawText("TIME UP!", cx, cy + 40, 20, "center");
        time = 600;
        if (status == "Retry") {
            drawText("TIME UP!", cx, cy - 40, 20, "center");
            time = 0;
        }
    }
    drawText("SCORE : " + score, 5, 20);
    drawText("TIME : " + (time / 10).toFixed(1), width - 130, 20);

    window.requestAnimationFrame(update);
}

const drawText = (text, x, y, size = 20, align = "left") => {
    let str = String(text);
    if (str.indexOf("0x") > -1) {
        str = String.fromCodePoint(parseInt(str.substring(2), 16));
    }
    context.font = `${size}px Arial Black`;
    context.textAlign = align;
    context.textBaseline = "middle";
    context.fillStyle = "white";
    context.fillText(str, x, y);
};

window.onload = init;
