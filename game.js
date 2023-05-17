const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

class GameObject {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = 50;
    this.dx = Math.random() * 4 - 2;
    this.dy = Math.random() * 4 - 2;
  }

  draw() {
    ctx.fillStyle =
      this.type === "rock" ? "gray" : this.type === "paper" ? "white" : "red";
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x < 0 || this.x + this.size > canvas.width) {
      this.dx = -this.dx;
    }

    if (this.y < 0 || this.y + this.size > canvas.height) {
      this.dy = -this.dy;
    }
  }
}

const gameObjects = [];

for (let i = 0; i < 5; i++) {
  gameObjects.push(
    new GameObject(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      "rock"
    )
  );
  gameObjects.push(
    new GameObject(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      "paper"
    )
  );
  gameObjects.push(
    new GameObject(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      "scissors"
    )
  );
}

function checkCollision(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.size &&
    obj1.x + obj1.size > obj2.x &&
    obj1.y < obj2.y + obj2.size &&
    obj1.y + obj1.size > obj2.y
  );
}

function resolveCollision(obj1, obj2) {
  if (obj1.type === obj2.type) {
    obj1.dx = -obj1.dx;
    obj1.dy = -obj1.dy;
    obj2.dx = -obj2.dx;
    obj2.dy = -obj2.dy;
  } else {
    const winner =
      (obj1.type === "rock" && obj2.type === "scissors") ||
      (obj1.type === "paper" && obj2.type === "rock") ||
      (obj1.type === "scissors" && obj2.type === "paper")
        ? obj1
        : obj2;
    const loserIndex = gameObjects.indexOf(winner === obj1 ? obj2 : obj1);
    gameObjects.splice(loserIndex, 1);
    winner.dx = -winner.dx;
    winner.dy = -winner.dy;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const gameObject of gameObjects) {
    gameObject.update();
    gameObject.draw();
  }

  for (let i = 0; i < gameObjects.length; i++) {
    for (let j = i + 1; j < gameObjects.length; j++) {
      if (checkCollision(gameObjects[i], gameObjects[j])) {
        resolveCollision(gameObjects[i], gameObjects[j]);
      }
    }
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
