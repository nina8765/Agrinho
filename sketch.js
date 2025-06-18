                                                                                              
let jogador;
let items = [];
let itemSize = 35;
let maxItems = 7;
let score = 0;
let vidas = 3;
let gameStarted = false;
let moveDir = 0;
let speed = 6;

function setup() {
  createCanvas(400, 400);
  jogador = new Jogador();

  for (let i = 0; i < maxItems; i++) {
    items.push(new Item(random(itemSize, width - itemSize), random(-200, -50)));
  }

  updateScore();
  textAlign(CENTER, CENTER);
  textSize(26);
  noStroke();
}

function draw() {
  background('#e1f5fe');
  desenharCenario();

  if (!gameStarted) {
    textSize(32);
    fill('#1976d2');
    text('Aperte C para Começar', width / 2, height / 2);
    return;
  }

  jogador.move();
  jogador.mostrar();

  for (let i = items.length - 1; i >= 0; i--) {
    let item = items[i];

    // Aumenta velocidade levemente com pontuação
    item.speed = 1.5 + random(0.8) + score * 0.001;

    item.mover();
    item.mostrar();

    let distancia = dist(item.x, item.y, jogador.x, jogador.y);
    if (distancia < (item.size / 2 + jogador.w / 2) * 1.4) { // margem de colisão aumentada
      score += 10;
      updateScore();
      coletarAnimacao(item.x, item.y);
      item.x = random(itemSize, width - itemSize);
      item.y = random(-200, -70);
    } else if (item.foraDaTela()) {
      vidas--;
      item.x = random(itemSize, width - itemSize);
      item.y = random(-200, -70);
    }
  }

  // HUD
  fill('#d32f2f');
  textSize(20);
  text('Vidas: ' + vidas, width / 2, 30);

  fill('#1976d2');
  textSize(20);
  text('Pontos: ' + score, width / 2, 60);

  if (vidas <= 0) {
    fill('#d32f2f');
    textSize(32);
    text('GAME OVER', width / 2, height / 2);
    textSize(20);
    fill('#1976d2');
    text('Aperte R para reiniciar', width / 2, height / 1.5);
    noLoop();
  }

  limparAnims();
}

function desenharCenario() {
  noStroke();
  fill('#81c784');
  rect(0, 0, width / 2, height);

  stroke('#4caf50');
  strokeWeight(3);
  for (let i = 10; i < height; i += 40) {
    line(45, i, 45, i + 20);
    noStroke();
    fill('#388e3c');
    triangle(40, i + 10, 45, i, 50, i + 10);
    triangle(40, i + 15, 45, i + 20, 50, i + 15);
  }

  fill('#90a4ae');
  rect(width / 2, 0, width / 2, height);

  fill('#546e7a');
  let predioAltura = 150;
  for (let x = width / 2 + 35; x < width - 30; x += 50) {
    rect(x, height - predioAltura, 40, predioAltura, 5);
    fill('#cfd8dc');
    for (let y = height - predioAltura + 20; y < height - 20; y += 30) {
      rect(x + 10, y, 8, 15, 2);
    }
    fill('#546e7a');
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    moveDir = -1;
  } else if (keyCode === RIGHT_ARROW) {
    moveDir = 1;
  } else if (key === 'c' || key === 'C') {
    if (!gameStarted) {
      gameStarted = true;
      loop();
    }
  } else if (key === 'r' || key === 'R') {
    if (vidas <= 0) {
      score = 0;
      vidas = 3;
      items.forEach(item => {
        item.x = random(itemSize, width - itemSize);
        item.y = random(-200, -70);
      });
      gameStarted = false;
      loop();
    }
  }
}

function keyReleased() {
  if ((keyCode === LEFT_ARROW && moveDir === -1) || (keyCode === RIGHT_ARROW && moveDir === 1)) {
    moveDir = 0;
  }
}

function updateScore() {
  let scoreboard = document.getElementById('scoreboard');
  if (scoreboard) {
    scoreboard.innerText = 'Pontos: ' + score;
  }
}

// Animações
let anims = [];
function coletarAnimacao(x, y) {
  anims.push({ x: x, y: y, radius: 5, alpha: 255 });
}

function limparAnims() {
  for (let i = anims.length - 1; i >= 0; i--) {
    let a = anims[i];
    fill(249, 168, 37, a.alpha);
    noStroke();
    ellipse(a.x, a.y, a.radius * 2);
    a.radius += 1.5;
    a.alpha -= 15;
    if (a.alpha <= 0) {
      anims.splice(i, 1);
    }
  }
}

// Jogador
class Jogador {
  constructor() {
    this.w = 90; // tamanho aumentado
    this.h = 45;
    this.x = width / 2;
    this.y = height - 60;
  }
  move() {
    this.x += moveDir * speed;
    this.x = constrain(this.x, this.w / 2, width - this.w / 2);
  }
  mostrar() {
    push();
    translate(this.x, this.y);
    fill('#4caf50');
    stroke('#2e7d32');
    strokeWeight(2);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h, 12);
    fill('#2e7d32');
    rect(20, -15, 38, 25, 8);
    fill('#333');
    noStroke();
    ellipse(-25, 20, 24, 24);
    ellipse(25, 20, 24, 24);
    fill('#a5d6a7');
    rect(20, -15, 18, 15, 4);
    pop();
  }
}

// Itens
class Item {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = itemSize;
    this.speed = 1.5 + random(0.8); // reduzida
    let colors = [
      { base: '#ff7043', detail: '#ffca28' },
      { base: '#81c784', detail: '#4caf50' },
      { base: '#ba68c8', detail: '#9c27b0' },
      { base: '#f06292', detail: '#e91e63' },
      { base: '#4dd0e1', detail: '#00bcd4' }
    ];
    let c = random(colors);
    this.baseColor = c.base;
    this.detailColor = c.detail;
  }
  mover() {
    this.y += this.speed;
  }
  mostrar() {
    push();
    translate(this.x, this.y);
    noStroke();
    fill(this.baseColor);
    rectMode(CENTER);
    rect(0, 0, this.size * 0.8, this.size * 0.6, 10);
    fill(this.detailColor);
    ellipse(-7, -5, this.size * 0.3, this.size * 0.3);
    ellipse(0, -12, this.size * 0.3, this.size * 0.3);
    ellipse(8, -8, this.size * 0.3, this.size * 0.3);
    fill('#388e3c');
    triangle(-10, -15, -7, -22, -4, -15);
    triangle(10, -14, 13, -21, 16, -14);
    pop();
  }
  foraDaTela() {
    return this.y > height + this.size / 2;
  }
}
