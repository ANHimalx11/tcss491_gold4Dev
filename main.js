var AM = new AssetManager();
var spawnX = 0;
var spawnY = 0;
var baseX = 0;
var baseY = 0;
var lastX, lastY;
var distance = 24;
var level = 1;
var temp1 = 0, temp2  = 0;
var map =  [['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', ],
            ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', ],
            ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', ],
            ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', 'b', 'p', 'b', ],
            ['b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', '-', '-', '-', '-', '-', 'b', 'm', 'b', ],
            ['s', 'm', 'm', 'm', 'm', 'm', 'm', 'b', '-', '-', '-', '-', '-', 'b', 'm', 'b', ],
            ['b', 'b', 'b', 'b', 'b', 'b', 'm', 'b', '-', '-', '-', '-', '-', 'b', 'm', 'b', ],
            ['-', '-', '-', '-', '-', 'b', 'm', 'b', '-', '-', '-', '-', '-', 'b', 'm', 'b', ],
            ['-', '-', '-', '-', '-', 'b', 'm', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'm', 'b', ],
            ['-', '-', '-', '-', '-', 'b', 'm', 'm', 'm', 'm', 'm', 'm', 'm', 'm', 'm', 'b', ],
            ['-', '-', '-', '-', '-', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', ],
            ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', ],
            ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', ],
            ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', ]
            ];

var level1spawn = ['1', '2', '1', '2', '1', '2', '1', '2', '1', '2', '1', '1', '2', '2'];
var level2spawn = ['1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'];
function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {

};

Background.prototype.update = function () {
};



function base(game, spritesheet) {
    this.animation = new Animation(spritesheet, 50, 50, 1, 0.15, 1, true, 1);
    this.ctx = game.ctx;
    this.health = 200;
    this.name = "base";
    this.x = baseX;
    this.y = baseY;
    this.radius = 25;
    this.game = game;
    this.isDead = 0;
    Entity.call(this, game, baseX, baseY);
}

base.prototype = new Entity();
base.prototype.constructor = base;

base.prototype.update = function () {
    //if the enemy is in the player's base die and decrease the base health
    Entity.prototype.update.call(this);
}

base.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}



function spawner(game, spritesheet, gameEngine) {
    this.animation = new Animation(spritesheet, 50, 50, 1, 0.15, 1, true, 1);
    this.ctx = game.ctx;
    this.gameEngine = gameEngine;
    this.name = "spawner";
    this.gameEngine = game;
    this.radius = 25;
    this.isDead = 0;
    this.index = 0;
    //this.level = 1;
    //this.spawnTime = 500; //500ms
    //Entity.call(this, game, spawnX - 50, spawnY - 50);
    Entity.call(this, game, spawnX, spawnY);
}

spawner.prototype = new Entity();
spawner.prototype.constructor = spawner;

spawner.prototype.update = function () {
    var time = this.gameEngine.timer.gameTime;
    if (this.index < level1spawn.length) {
        if(level1spawn[this.index] == '1' && time >= 0.5 * this.index) {
            this.gameEngine.addEntity(new Enemy1(this.gameEngine, AM.getAsset("./img/Enemy1walk.png")));
            this.index = this.index + 1;
        }
        
        if (level1spawn[this.index] == '2' && time >= 0.5 * this.index) {
            this.gameEngine.addEntity(new Enemy1(this.gameEngine, AM.getAsset("./img/enemy2.png")));
            this.index = this.index + 1;
        }
    }

    Entity.prototype.update.call(this);
}

spawner.prototype.draw = function () {
    //this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}






function Enemy1(game, spritesheet) {
    this.animation = new Animation(spritesheet, 100, 55, 6, 0.15, 6, true, 1.0);
    this.speed = 500;
    this.ctx = game.ctx;
    this.game = game;
    this.damage = 10;
    this.sizeX = 50;
    this.sizeY = 50;
    this.radius = 25;
    this.isDead = 0;
    this.name = "enemy1";
    this.visited = [['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ];
    Entity.call(this, game, spawnX, spawnY);
}



Enemy1.prototype = new Entity();
Enemy1.prototype.constructor = Enemy1;

function distance(a, b) {
    var difX = a.x - b.x;
    var difY = a.y - b.y;
    return Math.sqrt(difX * difX + difY * difY);
};

Enemy1.prototype.collide = function(other) {
    var difX = this.x - other.x;
    var difY = this.y - other.y;
    return Math.sqrt(difX * difX + difY * difY) < this.radius + other.radius;
};
Enemy1.prototype.update = function () {
    if(this.isDead != 1) {
        for(var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (ent.name == "base") {
                if(this.collide(ent)) {
                    this.isDead = 1;
                    //this.game.entities.splice(i, 1);
                }

                //if enemy collides with a projectile or hero ability then...
            }
        }
        var currentXFrame = Math.floor((this.x) / 50);
        var currentYFrame = Math.floor((this.y) / 50);

        if((map[currentYFrame][currentXFrame + 1] == 'm' || map[currentYFrame][currentXFrame + 1] == 'p')   && this.visited[currentYFrame][currentXFrame + 1] == '0') {
            this.x += this.game.clockTick * this.speed;
            this.visited[currentYFrame][currentXFrame] = '1';
         }
        if((map[currentYFrame][currentXFrame - 1] == 'm' || map[currentYFrame][currentXFrame - 1] == 'p')   && this.visited[currentYFrame][currentXFrame - 1] == '0') {
            this.x -= this.game.clockTick * this.speed;
            this.visited[currentYFrame][currentXFrame] = '1';
        }
     
        if((map[currentYFrame - 1][currentXFrame] == 'm' || map[currentYFrame - 1][currentXFrame] == 'p') && this.visited[currentYFrame - 1][currentXFrame] == '0') {
              this.y -= this.game.clockTick * this.speed;
              this.visited[currentYFrame][currentXFrame] = '1';
        }
         
         
        if((map[currentYFrame + 1][currentXFrame] == 'm' || map[currentYFrame + 1][currentXFrame] == 'p') && this.visited[currentYFrame + 1][currentXFrame] == '0') {
             this.y += this.game.clockTick * this.speed;
             this.visited[currentYFrame][currentXFrame] = '1';
        }
        //if the enemy is in the player's base die and decrease the base health
        Entity.prototype.update.call(this);
    } else {
        for (var i = this.game.entities.length - 1; i >= 0; --i) {
            if (this.game.entities[i].isDead == 1) {


                //this.entities.splice(i, 1);
                //splice currently freezes the game
            }
        }
        //need to remove entity 
        this.x = -100;
        this.y = -100;
    }
    
}

Enemy1.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}


function Enemy2(game, spritesheet) {
    this.animation = new Animation(spritesheet, 100, 55, 6, 0.15, 6, true, 1.0);
    this.speed = 50;
    this.ctx = game.ctx;
    this.game = game;
    this.damage = 10;
    this.sizeX = 50;
    this.sizeY = 50;
    this.radius = 25;
    this.isDead = 0;
    this.name = "enemy1";
    this.visited = [['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', ],
                    ];
    Entity.call(this, game, spawnX, spawnY);
}



Enemy2.prototype = new Entity();
Enemy2.prototype.constructor = Enemy2;

function distance(a, b) {
    var difX = a.x - b.x;
    var difY = a.y - b.y;
    return Math.sqrt(difX * difX + difY * difY);
};

Enemy2.prototype.collide = function(other) {
    var difX = this.x - other.x;
    var difY = this.y - other.y;
    return Math.sqrt(difX * difX + difY * difY) < this.radius + other.radius;
};
Enemy2.prototype.update = function () {
    if(this.isDead != 1) {
        for(var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (ent.name == "base") {
                if(this.collide(ent)) {
                    this.isDead = 1;
                    //this.game.entities.splice(this, i);
                }

                //if enemy collides with a projectile or hero ability then...
            }
        }
        var currentXFrame = Math.floor((this.x) / 50);
        var currentYFrame = Math.floor((this.y) / 50);
        if((map[currentYFrame][currentXFrame + 1] == 'm' || map[currentYFrame][currentXFrame + 1] == 'p')   && this.visited[currentYFrame][currentXFrame + 1] == '0') {
            this.x += this.game.clockTick * this.speed;
            this.visited[currentYFrame][currentXFrame] = '1';
         }
        if((map[currentYFrame][currentXFrame - 1] == 'm' || map[currentYFrame][currentXFrame - 1] == 'p')   && this.visited[currentYFrame][currentXFrame - 1] == '0') {
            this.x -= this.game.clockTick * this.speed;
            this.visited[currentYFrame][currentXFrame] = '1';
        }
     
        if((map[currentYFrame - 1][currentXFrame] == 'm' || map[currentYFrame - 1][currentXFrame] == 'p') && this.visited[currentYFrame - 1][currentXFrame] == '0') {
              this.y -= this.game.clockTick * this.speed;
              this.visited[currentYFrame][currentXFrame] = '1';
        }
         
         
        if((map[currentYFrame + 1][currentXFrame] == 'm' || map[currentYFrame + 1][currentXFrame] == 'p') && this.visited[currentYFrame + 1][currentXFrame] == '0') {
             this.y += this.game.clockTick * this.speed;
             this.visited[currentYFrame][currentXFrame] = '1';
        }
        //if the enemy is in the player's base die and decrease the base health
        Entity.prototype.update.call(this);
    } else {
        //need to remove entity 
        this.x = -100;
        this.y = -100;
    }
    
}

Enemy2.prototype.draw = function () {
    this.prototype.rot
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function setSpawnPoint() {
    for (i = 0; i < map.length; i++) {
        for (j = 0; j < map[0].length; j++) {
            var temp = map[i][j];
            if(temp == 's') {
                //spawnX = (j * 50) - 100;
                //spawnY = i * 50 + 25;
                spawnX = j * 50;
                spawnY = i * 50;
            }
            if(temp == 'p') {
                baseX = j * 50;
                baseY = i * 50;
            }
        }
    }
}




AM.queueDownload("./img/Enemy1walk.png");
AM.queueDownload("./img/runningcat.png");
AM.queueDownload("./img/guy.jpg");
AM.queueDownload("./img/base2.png");
AM.queueDownload("./img/enemy2.png");
AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    setSpawnPoint();
    // gameEngine.addEntity(new base(gameEngine, AM.getAsset("./img/base.png")));
    gameEngine.addEntity(new spawner(gameEngine, AM.getAsset("./img/base2.png")));


    console.log("All Done!");
});