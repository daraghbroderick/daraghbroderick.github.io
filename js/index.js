var ball, topPaddle, bottomPaddle;
var paddleSpeed = 8;
var ballSpeed = 10;
var score1 = 0;
var score2 = 0;
var scoreLetters = ["C", "o", "d", "e", "r", "D", "o", "j", "o"];
var playerOneDiv = document.getElementById("play1");
var playerTwoDiv = document.getElementById("play2");
var finished = false;

function startGame() {
  myGameArea.start();
  ball = new component(10, 10, "white", 200, 300);
  topPaddle = new component(50, 10, "red", 175, 10);
  bottomPaddle = new component(50, 10, "red", 175, 580);
}

function gameover(winner) {
  finished = true;
  ctx = myGameArea.context;
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Player " + winner + " Wins!", 200, 150);
}

function reset(score2) {
  ball.speed = 0;
  ball.x = 200;
  ball.y = 300;
  topPaddle.x = 175;
  bottomPaddle.x = 175;
  if (score2) {
    ball.moveAngle = 0;
  } else {
    ball.moveAngle = 180;
  }
  setTimeout(function() {
    ball.speed = ballSpeed;
  }, 2 * 1000);
}

function addScore(player) {
  if (player == 1) {
    score1++;
    playerOneDiv.innerHTML += scoreLetters[score1-1];
    //playerOneDiv.innerHTML = "Player 1: " + score1;//Score in numbers
  } else {
    score2++;
    playerTwoDiv.innerHTML += scoreLetters[score2-1];
    //playerTwoDiv.innerHTML = "Player 2: " + score2;//Score in numbers
  }
  if (score1 == 9) {
    gameover(1);
  } else if (score2 == 9) {
    gameover(2);
  }
}

function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.angle = 0;
  this.moveAngle = 180;
  this.speed = ballSpeed;
  this.update = function() {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  // Game Physics used when the ball hits something
  this.newPos = function() {
    if (ball.x < 0) {
      //hits left side
      if (ball.moveAngle < 270) {
        //going down
        ball.moveAngle = 90 - (ball.moveAngle - 180) + 90;
      } else {
        //going up
        ball.moveAngle = 90 - (ball.moveAngle - 270);
      }
    }
    if (ball.x > 392) {
      //hits right side
      if (ball.moveAngle > 90) {
        //going down
        ball.moveAngle = 270 - (ball.moveAngle - 90);
      } else {
        //going up
        ball.moveAngle = 270 + (90 - ball.moveAngle);
      }
    }
    if (ball.crashWith(bottomPaddle)) {
      var bounceAngle = getBounceAngle(bottomPaddle);
      if (bounceAngle <= 0) {
        ball.moveAngle = bounceAngle * -1;
      } else {
        ball.moveAngle = 360 - bounceAngle;
      }
    }
    if (ball.crashWith(topPaddle)) {
      var bounceAngle = getBounceAngle(topPaddle);
      if (bounceAngle <= 0) {
        ball.moveAngle = 180 - bounceAngle * -1;
      } else {
        ball.moveAngle = 180 + bounceAngle;
      }
    }
    if (ball.y < 0) {// Ball hits the top, behind paddle
      addScore(2);
      reset(true);
    }
    if (ball.y > 592) {// Ball hits the bottom, behind paddle
      addScore(1);
      reset(false);
    }
    this.angle = this.moveAngle * Math.PI / 180;
    this.x += this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);
  };
  this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + this.width;
    var mytop = this.y;
    var mybottom = this.y + this.height;
    var otherleft = otherobj.x;
    var otherright = otherobj.x + otherobj.width;
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + otherobj.height;
    var crash = true;
    if (
      mybottom < othertop ||
      mytop > otherbottom ||
      myright < otherleft ||
      myleft > otherright
    ) {
      crash = false;
    }
    return crash;
  };
}

function getBounceAngle(paddle) {
  var relativeIntersectX =
    paddle.x + paddle.width / 2 - (ball.x + ball.width / 2);
  var normalisedRIX = relativeIntersectX / (paddle.width / 2);
  return normalisedRIX * 60; // num between -60 and 60 (min and max bounce angle)
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 400;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener("keydown", function(e) {
      myGameArea.keys = myGameArea.keys || [];
      myGameArea.keys[e.keyCode] = true;
    });
    window.addEventListener("keyup", function(e) {
      myGameArea.keys[e.keyCode] = false;
    });
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

function updateGameArea() {
  if (!finished) {
    myGameArea.clear();
    if (myGameArea.keys && myGameArea.keys[37]) {
      topPaddle.x += -paddleSpeed;
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
      topPaddle.x += paddleSpeed;
    }
    if (myGameArea.keys && myGameArea.keys[65]) {
      bottomPaddle.x += -paddleSpeed;
    }
    if (myGameArea.keys && myGameArea.keys[68]) {
      bottomPaddle.x += paddleSpeed;
    }
    ball.newPos();
    ball.update();
    topPaddle.update();
    bottomPaddle.update();
  }
}

startGame();