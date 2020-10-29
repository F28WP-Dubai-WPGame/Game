document.addEventListener('DOMContentLoaded', () => {

  const scoreDisplay = document.getElementById('score')
  const width = 20
  let score = 0
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
    2, 2, 2, 2, 2, 2, 2, 1, 9, 9, 9, 9, 1, 2, 2, 2, 2, 2, 2, 2,
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

  const squares = []

  //create your board
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
        squares[i].classList.add('blank')
      }
    }
  }
  createBoard()

  let pacmanCurrentIndex = 288
  squares[pacmanCurrentIndex].classList.add('pacman')

  function movePacman(e) {
    squares[pacmanCurrentIndex].classList.remove('pacman')
    switch (e.keyCode) {
      case 37:
        if (
          !squares[pacmanCurrentIndex - 1].classList.contains('wall') &&
          !squares[pacmanCurrentIndex - 1].classList.contains('ghost-lair')
        )
          pacmanCurrentIndex -= 1
        if (squares[pacmanCurrentIndex - 1] === squares[219]) {
          pacmanCurrentIndex = 239
        }
        break
      case 38:
        if (
          !squares[pacmanCurrentIndex - width].classList.contains('wall') &&
          !squares[pacmanCurrentIndex - width].classList.contains('ghost-lair')
        )
          pacmanCurrentIndex -= width
        break
      case 39:
        if (
          !squares[pacmanCurrentIndex + 1].classList.contains('wall') &&
          !squares[pacmanCurrentIndex + 1].classList.contains('ghost-lair')
        )
          pacmanCurrentIndex += 1
        if (squares[pacmanCurrentIndex + 1] === squares[240]) {
          pacmanCurrentIndex = 220
        }
        break
      case 40:
        if (
          !squares[pacmanCurrentIndex + width].classList.contains('wall') &&
          !squares[pacmanCurrentIndex + width].classList.contains('ghost-lair')
        )
          pacmanCurrentIndex += width
        break
    }

    squares[pacmanCurrentIndex].classList.add('pacman')
    // pacDotEaten()
    // powerPelletEaten()
    // checkForGameOver()
    // checkForWin()
  }
  document.addEventListener('keyup', movePacman)

})