var socket = io();
var signDiv = document.getElementById('signDiv');
var signDivUsername = document.getElementById('signDiv-username');
var signDivSignIn = document.getElementById('signDiv-signIn');
var signDivSignUp = document.getElementById('signDiv-signUp');
var signDivPassword = document.getElementById('signDiv-password');

const grid = document.querySelector('.grid')
var player1 = document.getElementById('player1');
var player2 = document.getElementById('player2');
var player3 = document.getElementById('player3');
var player4 = document.getElementById('player4');

let playerOne;
let playerTwo;
let playerThree;
let playerFour;

let squares = []
let pacmanCurrentIndex = 214;
let pacmanPreviousIndex;
let score = 0;
const width = 19;

let username;
let uniqueCode;

// socket.on('connectToRoom', function (data) {
//   document.body.innerHTML = '';
//   document.write(data);
// });

signDivSignIn.onclick = function () {
  socket.emit('signIn', { username: signDivUsername.value, password: signDivPassword.value });
  username = signDivUsername.value;
  console.log(username);
}

signDivSignUp.onclick = function () {
  socket.emit('signUp', { username: signDivUsername.value, password: signDivPassword.value });
}

socket.on('signInResponse', function (data) {
  if (data.success) {
    signDiv.style.display = 'none';
    gamestuff.style.display = 'inline-block';
    socket.emit('currentUserName', { code: uniqueCode, clientName: username })
  } else
    alert("Sign in unsuccessful.");
});

socket.on('signUpResponse', function (data) {
  if (data.success) {
    alert("Sign up successful.");
  } else
    alert("Sign up unsuccessful.");
});

const layout = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, //1
  1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, //2
  1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, //3
  1, 7, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 7, 1, //4
  1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, //5
  1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, //6
  1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, //7
  1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, //8
  0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, //9
  0, 0, 0, 1, 2, 1, 2, 1, 9, 1, 9, 1, 2, 1, 2, 1, 0, 0, 0, //10
  1, 1, 1, 1, 2, 1, 2, 9, 9, 9, 9, 9, 2, 1, 2, 1, 1, 1, 1, //11
  0, 2, 2, 2, 2, 2, 2, 1, 9, 9, 9, 1, 2, 2, 2, 2, 2, 2, 0, //12
  1, 1, 1, 1, 2, 1, 2, 9, 9, 9, 9, 9, 2, 1, 2, 1, 1, 1, 1, //13
  0, 0, 0, 1, 2, 1, 2, 1, 9, 1, 9, 1, 2, 1, 2, 1, 0, 0, 0, //14
  0, 0, 0, 1, 2, 1, 2, 0, 0, 0, 0, 0, 2, 1, 2, 1, 0, 0, 0, //15
  1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, //16
  1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, //17
  1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, //18
  1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, //19
  1, 7, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 7, 1, //20
  1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, //21
  1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, //22
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, //23
];

function createBoard() {
  for (let i = 0; i < layout.length; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
    squares.push(square)

    //add layout to the board
    if (layout[i] === 2) {
      squares[i].classList.add('pac-dot')
    } else if (layout[i] === 1) {
      squares[i].classList.add('wall')
    } else if (layout[i] === 9) {
      squares[i].classList.add('ghost-lair')
    } else if (layout[i] === 7) {
      squares[i].classList.add('power-pellet')
    } else if (layout[i] === 3) {
      squares[i].classList.add('hw-wall')
    } else {
      squares[i].classList.add('blank')
    }
  }

  for (let j = 0; j < layout.length; j++) {
    if (squares[j].classList.contains('pacman')) {
      squares[j].classList.remove('pacman')
    }
  }
}
createBoard();

class Ghost {
  constructor(className, startIndex, speed) {
    this.className = className
    this.startIndex = startIndex
    this.speed = speed
    this.currentIndex = startIndex
    this.isScared = false
    this.timerId = NaN
  }
}

ghosts = [
  new Ghost('blinky', 198, 250),
  new Ghost('pinky', 200, 250),
  new Ghost('inky', 236, 250),
  new Ghost('clyde', 238, 250)
]

ghosts.forEach(ghost => {
  squares[ghost.currentIndex].classList.add(ghost.className)
  squares[ghost.currentIndex].classList.add('ghost')
})


socket.emit('player-joined')
socket.on('pacman-code', function (data) {
  squares[pacmanCurrentIndex].classList.add('pacman')
  uniqueCode = data.playerCode;
})

socket.on('allPlayers', function (data) {
  playerOne = data[0];
  playerTwo = data[1];
  playerThree = data[2];
  playerFour = data[3];
})

setInterval(function () {
  socket.emit('updateScores', { code: uniqueCode, currentScore: score })
  socket.on('allScores', function (data) {
    player1.innerHTML = playerOne + ":" + data[0];
    player2.innerHTML = playerTwo + ":" + data[1];
    player3.innerHTML = playerThree + ":" + data[2];
    player4.innerHTML = playerFour + ":" + data[3];
  })
}, 100)


function move(currentIndex, previousIndex) {
  squares[previousIndex].classList.remove('pacman', 'pacman-right', 'pacman-left', 'pacman-up', 'pacman-down')
  squares[currentIndex].classList.add('pacman')
}

document.addEventListener('keyup', movePacman)

function movePacman(event) {

  //left
  if (event.keyCode === 37 && !squares[pacmanCurrentIndex - 1].classList.contains('wall') && !squares[pacmanCurrentIndex - 1].classList.contains('ghost-lair')) {

    if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
      squares[pacmanCurrentIndex].classList.remove('pac-dot')
      score++;
    }
    powerPelletEaten();

    pacmanPreviousIndex = pacmanCurrentIndex;
    pacmanCurrentIndex = pacmanCurrentIndex - 1
    move(pacmanCurrentIndex, pacmanPreviousIndex);
    squares[pacmanCurrentIndex].classList.add('pacman-left')


    //up
  } else if (event.keyCode === 38 && !squares[pacmanCurrentIndex - width].classList.contains('wall') && !squares[pacmanCurrentIndex - width].classList.contains('ghost-lair')) {

    if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
      squares[pacmanCurrentIndex].classList.remove('pac-dot');
      score++;
    }

    powerPelletEaten();


    pacmanPreviousIndex = pacmanCurrentIndex;
    pacmanCurrentIndex = pacmanCurrentIndex - width
    move(pacmanCurrentIndex, pacmanPreviousIndex);
    squares[pacmanCurrentIndex].classList.add('pacman-up')

    //right
  } else if (event.keyCode === 39 && !squares[pacmanCurrentIndex + 1].classList.contains('wall') && !squares[pacmanCurrentIndex + 1].classList.contains('ghost-lair')) {

    if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
      squares[pacmanCurrentIndex].classList.remove('pac-dot')
      score++;
    }
    powerPelletEaten();


    pacmanPreviousIndex = pacmanCurrentIndex;
    pacmanCurrentIndex = pacmanCurrentIndex + 1
    move(pacmanCurrentIndex, pacmanPreviousIndex);
    squares[pacmanCurrentIndex].classList.add('pacman-right')

    //down
  } else if (event.keyCode === 40 && !squares[pacmanCurrentIndex + width].classList.contains('wall') && !squares[pacmanCurrentIndex + width].classList.contains('ghost-lair')) {

    if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
      squares[pacmanCurrentIndex].classList.remove('pac-dot')
      score++;
    }

    powerPelletEaten();

    pacmanPreviousIndex = pacmanCurrentIndex;
    pacmanCurrentIndex = pacmanCurrentIndex + width
    move(pacmanCurrentIndex, pacmanPreviousIndex);
    squares[pacmanCurrentIndex].classList.add('pacman-down')
  }
}

// socket.on('startGame', function () {
//   ghosts.forEach(ghost => moveGhost(ghost))
// })
ghosts.forEach(ghost => moveGhost(ghost))

function moveGhost(ghost) {
  const directions = [-1, +1, width, -width]
  let direction = directions[Math.floor(Math.random() * directions.length)]

  ghost.timerId = setInterval(function () {
    //if the next squre your ghost is going to go to does not have a ghost and does not have a wall
    if (!squares[ghost.currentIndex + direction].classList.contains('ghost') &&
      !squares[ghost.currentIndex + direction].classList.contains('wall')) {
      //remove the ghosts classes
      squares[ghost.currentIndex].classList.remove(ghost.className)
      squares[ghost.currentIndex].classList.remove('ghost', 'scared')
      //move into that space
      ghost.currentIndex += direction
      squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
      //else find a new random direction ot go in
    } else direction = directions[Math.floor(Math.random() * directions.length)]

    //if the ghost is currently scared
    if (ghost.isScared) {
      squares[ghost.currentIndex].classList.add('scared')
    }

    //if the ghost is currently scared and pacman is on it
    if (ghost.isScared && squares[ghost.currentIndex].classList.contains('pacman')) {
      squares[ghost.currentIndex].classList.remove(ghost.className, 'ghost', 'scared')
      ghost.currentIndex = ghost.startIndex
      score += 100
      squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
    }
    checkForGameOver()
  }, ghost.speed)
}

function powerPelletEaten() {
  if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
    score += 10
    ghosts.forEach(ghost => ghost.isScared = true)
    setTimeout(unScareGhosts, 10000)
    squares[pacmanCurrentIndex].classList.remove('power-pellet')
  }
}

function unScareGhosts() {
  ghosts.forEach(ghost => ghost.isScared = false)
}

//check for a game over
function checkForGameOver() {
  if (squares[pacmanCurrentIndex].classList.contains('ghost') &&
    !squares[pacmanCurrentIndex].classList.contains('scared')) {
    squares[pacmanCurrentIndex].classList.remove('pacman', 'pacman-left', 'pacman-up', 'pacman-down', 'pacman-right')
    ghosts.forEach(ghost => clearInterval(ghost.timerId))
    setTimeout(function () { alert("Game Over"); }, 500)
    // socket.emit('playerGameOver', { code: uniqueCode, gameState: false })
    document.removeEventListener('keyup', movePacman)
  }
}

