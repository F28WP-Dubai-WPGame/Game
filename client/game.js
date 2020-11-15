var chatText = document.getElementById('chat-text');
var chatInput = document.getElementById('chat-input');
var chatForm = document.getElementById('chat-form');

var socket = io.connect('http://localhost:3000/')
let pacmanCurrentIndex = 0;
const grid = document.querySelector('.grid')
const layout = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
  1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1,
  1, 7, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 7, 1,
  1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
  1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1,
  1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1,
  1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1,
  0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0,
  0, 0, 0, 1, 2, 1, 2, 1, 9, 9, 9, 9, 1, 2, 1, 2, 1, 0, 0, 0,
  1, 1, 1, 1, 2, 1, 2, 1, 9, 9, 9, 9, 1, 2, 1, 2, 1, 1, 1, 1,
  0, 2, 2, 2, 2, 2, 2, 1, 9, 9, 9, 9, 1, 2, 2, 2, 2, 2, 2, 0,
  1, 1, 1, 1, 2, 1, 2, 1, 9, 9, 9, 9, 1, 2, 1, 2, 1, 1, 1, 1,
  0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0,
  0, 0, 0, 1, 2, 1, 2, 0, 0, 0, 0, 0, 0, 2, 1, 2, 1, 0, 0, 0,
  1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1,
  1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1,
  1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1,
  1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
  1, 7, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 7, 1,
  1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1,
  1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,];

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
    } else {
      squares[i].classList.add('pac-dot')
    }
  }
}
createBoard();

socket.on('newPositions', function (data) {
  for (var i = 0; i < data.length; i++) {
    squares[data[i].currentIndex].classList.add('pacman')
    pacmanCurrentIndex = data[i].currentIndex;
  }
});

document.onkeydown = function (event) {
  squares[pacmanCurrentIndex].classList.remove('pacman')

  //left
  if (event.keyCode === 37
    && !squares[pacmanCurrentIndex - 1].classList.contains('wall')
    && !squares[pacmanCurrentIndex - 1].classList.contains('ghost-lair'))

    socket.emit('keyPress', { inputId: 'left', state: true });
  //up
  else if (event.keyCode === 38
    && !squares[pacmanCurrentIndex - width].classList.contains('wall')
    && !squares[pacmanCurrentIndex - width].classList.contains('ghost-lair'))

    socket.emit('keyPress', { inputId: 'up', state: true });
  //right
  else if (event.keyCode === 39
    && !squares[pacmanCurrentIndex + 1].classList.contains('wall')
    && !squares[pacmanCurrentIndex + 1].classList.contains('ghost-lair'))

    socket.emit('keyPress', { inputId: 'right', state: true });
  //down
  else if (event.keyCode === 40
    && !squares[pacmanCurrentIndex + width].classList.contains('wall')
    && !squares[pacmanCurrentIndex + width].classList.contains('ghost-lair'))

    socket.emit('keyPress', { inputId: 'down', state: true });

}
document.onkeyup = function (event) {
  //left
  if (event.keyCode === 37)
    socket.emit('keyPress', { inputId: 'left', state: false });
  //up
  else if (event.keyCode === 38)
    socket.emit('keyPress', { inputId: 'up', state: false });
  //right
  else if (event.keyCode === 39)
    socket.emit('keyPress', { inputId: 'right', state: false });
  //down
  else if (event.keyCode === 40)
    socket.emit('keyPress', { inputId: 'down', state: false });

}