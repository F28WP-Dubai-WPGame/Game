var socket = io();
var signDiv = document.getElementById('signDiv');
var signDivUsername = document.getElementById('signDiv-username');
var signDivSignIn = document.getElementById('signDiv-signIn');
var signDivSignUp = document.getElementById('signDiv-signUp');
var signDivPassword = document.getElementById('signDiv-password');

var player1 = document.getElementById('player1');
var player2 = document.getElementById('player2');
var player3 = document.getElementById('player3');
var player4 = document.getElementById('player4');

let username;
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

let pacmanCurrentIndex = 203;
let pacmanPreviousIndex;
let score = 0;
const width = 37;
const grid = document.querySelector('.grid')
const layout = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 1
  1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, // 2
  1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 2, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, // 3
  1, 7, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 7, 1, // 4
  1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, // 5
  1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 7, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, // 6
  1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, // 7
  1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 0, 0, 0, 1, 0, 0, 0, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, // 8
  0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 3, 3, 0, 0, 0, 3, 3, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, // 9
  0, 0, 0, 1, 2, 1, 2, 1, 9, 1, 9, 1, 2, 1, 2, 3, 3, 3, 3, 3, 3, 3, 2, 1, 2, 1, 9, 1, 9, 1, 2, 1, 2, 1, 0, 0, 0, // 10
  1, 1, 1, 1, 2, 1, 2, 9, 9, 9, 9, 9, 2, 1, 2, 3, 3, 0, 0, 0, 3, 3, 2, 1, 2, 9, 9, 9, 9, 9, 2, 1, 2, 1, 1, 1, 1, // 12
  0, 2, 2, 2, 2, 2, 2, 1, 9, 9, 9, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 9, 9, 9, 1, 2, 2, 2, 2, 2, 2, 0, // 13
  1, 1, 1, 1, 2, 1, 2, 9, 9, 9, 9, 9, 2, 1, 2, 3, 0, 0, 3, 0, 0, 3, 2, 1, 2, 9, 9, 9, 9, 9, 2, 1, 2, 1, 1, 1, 1, // 14
  0, 0, 0, 1, 2, 1, 2, 1, 9, 1, 9, 1, 2, 1, 2, 3, 0, 3, 0, 3, 0, 3, 2, 1, 2, 1, 9, 1, 9, 1, 2, 1, 2, 1, 0, 0, 0, // 15
  0, 0, 0, 1, 2, 1, 2, 0, 0, 0, 0, 0, 2, 1, 2, 0, 3, 0, 0, 0, 3, 0, 2, 1, 2, 0, 0, 0, 0, 0, 2, 1, 2, 1, 0, 0, 0, // 16
  1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 0, 0, 0, 1, 0, 0, 0, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, // 17
  1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, // 18
  1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 7, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, // 19
  1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, // 20
  1, 7, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 7, 1, // 21
  1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 2, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, // 22
  1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, // 23
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 24
];

let squares = []
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
  new Ghost('blinky', 378, 250),
  new Ghost('pinky', 380, 250),
  new Ghost('inky', 452, 250),
  new Ghost('clyde', 454, 250),
  new Ghost('blinky2', 470, 250),
  new Ghost('pinky2', 472, 250),
  new Ghost('inky2', 396, 250),
  new Ghost('clyde2', 398, 250)
]

ghosts.forEach(ghost => {
  squares[ghost.currentIndex].classList.add(ghost.className)
  squares[ghost.currentIndex].classList.add('ghost')
})

let uniqueCode;
socket.emit('player-joined')
socket.on('pacman-code', function (data) {
  squares[pacmanCurrentIndex].classList.add('pacman')
  uniqueCode = data.playerCode;
})

setInterval(function () {
  // console.log(pacmanCurrentIndex)
  socket.emit('updateScores', { code: uniqueCode, currentScore: score })
  // socket.on('allPositions', function (data) {
  //   // console.log(data);
  //   // for (var i = 0; i < data.length; i++) {
  //   //   squares[data[i]].classList.add('pacman')
  //   // }
  // })
}, 100)


function move(currentIndex, previousIndex) {
  // for (let j = 0; j < layout.length; j++) {
  //   if (squares[j].classList.contains('pacman')) {
  //     squares[j].classList.remove('pacman')
  //   }
  // }

  squares[previousIndex].classList.remove('pacman')
  squares[currentIndex].classList.add('pacman')
}
var unScare;

document.onkeyup = function (event) {

  //left
  if (event.keyCode === 37
    && !squares[pacmanCurrentIndex - 1].classList.contains('wall')
    && !squares[pacmanCurrentIndex - 1].classList.contains('ghost-lair')) {

    if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
      squares[pacmanCurrentIndex].classList.remove('pac-dot')
      score++;
      console.log(score);
    }

    if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
      squares[pacmanCurrentIndex].classList.remove('power-pellet')
      score += 10;
      console.log(score);
    }


    pacmanPreviousIndex = pacmanCurrentIndex;
    pacmanCurrentIndex = pacmanCurrentIndex - 1
    move(pacmanCurrentIndex, pacmanPreviousIndex);


    //up
  } else if (event.keyCode === 38
    && !squares[pacmanCurrentIndex - width].classList.contains('wall')
    && !squares[pacmanCurrentIndex - width].classList.contains('ghost-lair')) {

    if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
      squares[pacmanCurrentIndex].classList.remove('pac-dot');
      score++;
      console.log(score);
    }

    if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
      squares[pacmanCurrentIndex].classList.remove('power-pellet')
      score += 10;
      console.log(score);
    }


    pacmanPreviousIndex = pacmanCurrentIndex;
    pacmanCurrentIndex = pacmanCurrentIndex - width
    move(pacmanCurrentIndex, pacmanPreviousIndex);

    //right
  } else if (event.keyCode === 39
    && !squares[pacmanCurrentIndex + 1].classList.contains('wall')
    && !squares[pacmanCurrentIndex + 1].classList.contains('ghost-lair')) {

    if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
      squares[pacmanCurrentIndex].classList.remove('pac-dot')
      score++;
      console.log(score);
    }
    if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
      squares[pacmanCurrentIndex].classList.remove('power-pellet')
      score += 10;
      console.log(score);
    }


    pacmanPreviousIndex = pacmanCurrentIndex;
    pacmanCurrentIndex = pacmanCurrentIndex + 1
    move(pacmanCurrentIndex, pacmanPreviousIndex);

    //down
  } else if (event.keyCode === 40
    && !squares[pacmanCurrentIndex + width].classList.contains('wall')
    && !squares[pacmanCurrentIndex + width].classList.contains('ghost-lair')) {

    if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
      squares[pacmanCurrentIndex].classList.remove('pac-dot')
      score++;
      console.log(score);
    }

    if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
      squares[pacmanCurrentIndex].classList.remove('power-pellet')
      score += 10;
      // unScare= setTimeout(function ​​(){
      //   ghosts.forEach(ghost => ghost.isScared = false)
      // }, 3000);
      // setInterval(function(){​​alert("Hello")}​​,3000);
      console.log(score);
    }

    pacmanPreviousIndex = pacmanCurrentIndex;
    pacmanCurrentIndex = pacmanCurrentIndex + width
    move(pacmanCurrentIndex, pacmanPreviousIndex);
  }
}


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
    //checkForGameOver()
  }, ghost.speed)
}


// function powerPelletEaten() {
//   if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
//     score += 10
//     ghosts.forEach(ghost => ghost.isScared = true)
//     setTimeout(unScareGhosts, 10000)
//     squares[pacmanCurrentIndex].classList.remove('power-pellet')
//   }
// }

// function unScareGhosts() {
//   ghosts.forEach(ghost => ghost.isScared = false)
// }
