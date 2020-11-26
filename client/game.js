var socket = io();
var signDiv = document.getElementById('signDiv');                   // accessing div signDiv
var signDivUsername = document.getElementById('signDiv-username');  // accessing div signDiv-username
var signDivSignIn = document.getElementById('signDiv-signIn');      // accessing div signDiv-signIn
var signDivSignUp = document.getElementById('signDiv-signUp');      // accessing div signDiv-signUp
var signDivPassword = document.getElementById('signDiv-password');  // accessing div signDiv-password

var chatText = document.getElementById('chat-text');                // accessing div chat-text
var chatInput = document.getElementById('chat-input');              // accessing div chat-input
var chatForm = document.getElementById('chat-form');                // accessing div chat-form

var timer = document.getElementById('timer')                        // accessing div timer
const grid = document.querySelector('.grid')                        // accessing class grid
var player1 = document.getElementById('player1');                   // accessing div player1
var player2 = document.getElementById('player2');                   // accessing div player2
var player3 = document.getElementById('player3');                   // accessing div player3
var player4 = document.getElementById('player4');                   // accessing div player4

let playerOne;          // username of player1
let playerTwo;          // username of player2
let playerThree;        // username of player3
let playerFour;         // username of player4

let squares = []               // array of classes
let pacmanCurrentIndex = 214;  // initial position of pacman
let pacmanPreviousIndex;       // position of pacman before moving into next place
let score = 0;                 // scores of the player
const width = 19;              // width of the grid

let username;                  // username of the player
let uniqueCode;                // unique code assigned to the player

socket.on('connectToRoom', function (data) {    //connecting to a room
  document.body.innerHTML = '';
  document.write(data);
});

signDivSignIn.onclick = function () {                                                          // signing in
  socket.emit('signIn', { username: signDivUsername.value, password: signDivPassword.value });
  username = signDivUsername.value;
  console.log(username);
}

signDivSignUp.onclick = function () {                                                          // signing up
  socket.emit('signUp', { username: signDivUsername.value, password: signDivPassword.value });
}

socket.on('signInResponse', function (data) {                                  // checking if sign in was successful
  if (data.success) {
    signDiv.style.display = 'none';
    gamestuff.style.display = 'inline-block';
    socket.emit('currentUserName', { code: uniqueCode, clientName: username })
  } else
    alert("Sign in unsuccessful.");
});

socket.on('signUpResponse', function (data) {                                 // checking if sign up was successful
  if (data.success) {
    alert("Sign up successful.");
  } else
    alert("Sign up unsuccessful.");
});

const layout = [                                           // our gameboard 
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, //1
  1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, //2
  1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, //3
  1, 7, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 7, 1, //4
  1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, //5
  1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, //6
  1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, //7
  1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, //8
  0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, //9
  0, 0, 0, 1, 2, 1, 2, 1, 9, 1, 9, 1, 2, 1, 2, 1, 0, 0, 0, //10
  1, 1, 1, 1, 2, 1, 2, 9, 9, 9, 9, 9, 2, 1, 2, 1, 1, 1, 1, //11
  0, 2, 2, 2, 2, 2, 2, 1, 9, 9, 9, 1, 2, 2, 2, 2, 2, 2, 0, //12
  1, 1, 1, 1, 2, 1, 2, 9, 9, 9, 9, 9, 2, 1, 2, 1, 1, 1, 1, //13
  0, 0, 0, 1, 2, 1, 2, 1, 9, 1, 9, 1, 2, 1, 2, 1, 0, 0, 0, //14
  0, 0, 0, 1, 2, 1, 2, 0, 0, 0, 0, 0, 2, 1, 2, 1, 0, 0, 0, //15
  1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, //16
  1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, //17
  1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, //18
  1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, //19
  1, 7, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 7, 1, //20
  1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, //21
  1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, //22
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, //23
];

function createBoard() {                           // creating the gameboard
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

class Ghost {                                   //ghost class to create our ghosts
  constructor(className, startIndex) {
    this.className = className
    this.startIndex = startIndex
    this.speed = 250
    this.currentIndex = startIndex
    this.isScared = false
    this.timerId = NaN
  }
}

ghosts = [
  new Ghost('blinky', 198),
  new Ghost('pinky', 200),
  new Ghost('inky', 236),
  new Ghost('clyde', 238)
]

ghosts.forEach(ghost => {                                    // adding ghosts to our game board
  squares[ghost.currentIndex].classList.add(ghost.className)
  squares[ghost.currentIndex].classList.add('ghost')
})


socket.emit('player-joined')
socket.on('pacman-code', function (data) {                   // assigning unique codes to our players
  squares[pacmanCurrentIndex].classList.add('pacman')
  uniqueCode = data.playerCode;
})

socket.on('allPlayers', function (data) {                    // usernames of the players
  playerOne = data[0];
  playerTwo = data[1];
  playerThree = data[2];
  playerFour = data[3];
})

socket.on('player-won', function (data) {                    // checking if a player has won
  ghosts.forEach(ghost => clearInterval(ghost.timerId))
  setTimeout(function () { alert(`${data} has won!!`); }, 500)
  document.removeEventListener('keyup', movePacman)
})

setInterval(function () {                                    // update the scores on the scoreboard every 100 milliseconds
  socket.emit('updateScores', { code: uniqueCode, currentScore: score })
  socket.on('allScores', function (data) {
    player1.innerHTML = playerOne + ":" + data[0];
    player2.innerHTML = playerTwo + ":" + data[1];
    player3.innerHTML = playerThree + ":" + data[2];
    player4.innerHTML = playerFour + ":" + data[3];
  })
}, 100)


function move(currentIndex, previousIndex) {                // function to move the pacman
  squares[previousIndex].classList.remove('pacman', 'pacman-right', 'pacman-left', 'pacman-up', 'pacman-down')
  squares[currentIndex].classList.add('pacman')
}

document.addEventListener('keyup', movePacman)              // moving the pacman in the direction of the respective arrow key pressed,

function movePacman(event) {

  //left
  if (event.keyCode === 37 && !squares[pacmanCurrentIndex - 1].classList.contains('wall') && !squares[pacmanCurrentIndex - 1].classList.contains('ghost-lair')) {

    if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
      squares[pacmanCurrentIndex].classList.remove('pac-dot')
      score++;
    }
    powerPelletEaten();           // function call to check if the pacman has eaten the powerpellet

    pacmanPreviousIndex = pacmanCurrentIndex;                // store currentindex of pacman before going to next position
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
  if (score > 200) {    // if score is greater than 200, the player wins
    alert('You winn!')
  }
}

ghosts.forEach(ghost => moveGhost(ghost))        // moving all the ghosts

function moveGhost(ghost) {
  const directions = [-1, +1, width, -width]
  let direction = directions[Math.floor(Math.random() * directions.length)]        //moving ghosts in random direction

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
    checkForGameOver()                                                                 // calling function to see if the player lost
  }, ghost.speed)
}

function powerPelletEaten() {            // check if power pellet is eaten
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
    document.removeEventListener('keyup', movePacman)
  }
}


socket.on('addToChat', function (data) {            // chat
  chatText.innerHTML += '<div>' + data + '</div>';
});

chatForm.onsubmit = function (e) {
  e.preventDefault();
  socket.emit('sendMsgToServer', [chatInput.value, username]);
  chatInput.value = '';
}
