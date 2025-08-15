class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        
        this.score = 0;
        this.player = new Player(this.canvas.width / 2, this.canvas.height - 50);
        this.bullets = [];
        this.enemies = [];
        this.keys = {};
        
        this.setupEventListeners();
        this.gameLoop();
        this.spawnEnemies();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }
    
    update() {
        this.player.update(this.keys, this.canvas);
        
        if (this.keys['Space'] && this.player.canShoot()) {
            this.bullets.push(new Bullet(this.player.x + this.player.width / 2, this.player.y));
            this.player.resetShootCooldown();
        }
        
        this.bullets.forEach((bullet, index) => {
            bullet.update();
            if (bullet.y < 0) {
                this.bullets.splice(index, 1);
            }
        });
        
        this.enemies.forEach((enemy, index) => {
            enemy.update();
            if (enemy.y > this.canvas.height) {
                this.enemies.splice(index, 1);
            }
        });
        
        this.checkCollisions();
    }
    
    checkCollisions() {
        this.bullets.forEach((bullet, bulletIndex) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (this.isColliding(bullet, enemy)) {
                    this.bullets.splice(bulletIndex, 1);
                    this.enemies.splice(enemyIndex, 1);
                    this.score += 10;
                    this.scoreElement.textContent = `スコア: ${this.score}`;
                }
            });
        });
        
        this.enemies.forEach((enemy, index) => {
            if (this.isColliding(this.player, enemy)) {
                alert(`ゲームオーバー！最終スコア: ${this.score}`);
                location.reload();
            }
        });
    }
    
    isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    render() {
        this.ctx.fillStyle = '#001122';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.player.render(this.ctx);
        
        this.bullets.forEach(bullet => {
            bullet.render(this.ctx);
        });
        
        this.enemies.forEach(enemy => {
            enemy.render(this.ctx);
        });
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    spawnEnemies() {
        setInterval(() => {
            const x = Math.random() * (this.canvas.width - 40);
            this.enemies.push(new Enemy(x, -40));
        }, 1000);
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 30;
        this.speed = 5;
        this.shootCooldown = 0;
    }
    
    update(keys, canvas) {
        if (keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] && this.x < canvas.width - this.width) {
            this.x += this.speed;
        }
        if (keys['ArrowUp'] && this.y > 0) {
            this.y -= this.speed;
        }
        if (keys['ArrowDown'] && this.y < canvas.height - this.height) {
            this.y += this.speed;
        }
        
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
    }
    
    canShoot() {
        return this.shootCooldown <= 0;
    }
    
    resetShootCooldown() {
        this.shootCooldown = 10;
    }
    
    render(ctx) {
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 5, this.y - 5, 5, 10);
        ctx.fillRect(this.x + this.width - 10, this.y - 5, 5, 10);
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x - 2;
        this.y = y;
        this.width = 4;
        this.height = 10;
        this.speed = 7;
    }
    
    update() {
        this.y -= this.speed;
    }
    
    render(ctx) {
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 30;
        this.speed = 2;
    }
    
    update() {
        this.y += this.speed;
    }
    
    render(ctx) {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 10, this.y + 5, 8, 8);
        ctx.fillRect(this.x + 22, this.y + 5, 8, 8);
    }
}

window.addEventListener('load', () => {
    new Game();
});