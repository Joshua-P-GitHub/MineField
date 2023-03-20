//DOM Variables
const gameArea = document.querySelector('.game-area')
const DOMSquare = document.querySelector('.square')
const dice = document.querySelector('#dice-number')
//Functions
const sleep = async (milliseconds) => {
  await new Promise(resolve => {
    return setTimeout(resolve, milliseconds)
  })
}
//Classes
class GameController {
  constructor(difficulty) {
    this.difficulty = difficulty
    this.map = [
      [],
      [],
      [],
      [],
      [],
      [],
      []
    ]
    this.playerCurrentPosition = [7, 7]
    this.playerCurrentSquare = null

  }
  static squareCount = 0

  createMineMap() {
    let rowInt = 1
    for (let row of this.map) {

      for (let i = 0; i < 7; i++) {
        row.push(new Square(null, false, false, [rowInt, i + 1]))
      }
      rowInt++
    }
    rowInt = 1
    for (let row of this.map) {
      let spots = [1, 2, 3, 4, 5, 6, 7]
      if (rowInt === 1) {
        spots.shift()
      } else if (rowInt === 7) {
        spots.pop()
      }
      for (let i = 0; i < 2; i++) {
        let int = Math.floor(Math.random() * spots.length)
        int = spots[int]
        let chosenSqaure = this.map[rowInt - 1][int - 1]
        chosenSqaure.isItAMine = true;
        spots.splice(int - 1, 1)
      }
      rowInt++
    }
    this.playerCurrentSquare = this.map[6][6]
  }


  async createsDOMSquares(callback) {
    for (let i = 1; i <= 49; i++) {
      let newSquare = document.createElement('div')
      newSquare.id = `square${i}`
      newSquare.classList.add('square')
      gameArea.appendChild(newSquare)
      await sleep(65)
    }
    return callback
  }

  async changePlayerCurrentPosition(position) {
    let selectedSquare = document.getElementById(`${this.playerCurrentSquare.squareId}`)
    if (selectedSquare.classList.contains('selected')) {
      selectedSquare.classList.remove('selected')
      if (!this.playerCurrentSquare.isItAMine) {
        selectedSquare.style.backgroundColor = 'blue'
      }
    }
    this.playerCurrentPosition = []
    this.playerCurrentPosition.push(position[0], position[1])
    this.playerCurrentSquare = this.map[this.playerCurrentPosition[0] - 1][this.playerCurrentPosition[1] - 1]
    console.log(this.playerCurrentSquare);
    selectedSquare = document.getElementById(`${this.playerCurrentSquare.squareId}`)
    console.dir(selectedSquare);
    selectedSquare.classList.add('selected')
  }

  checkIfPlayerIsOnMine() {
    if (this.playerCurrentPosition.isItAMine) {

    }
  }


  async rollDice() {
    for (let i = 0; i < 20; i++) {
      let randomNum = Math.floor((Math.random() * 6) + 1)
      dice.innerText = randomNum
      await sleep(25)
    }
    return randomNum;
  }

  selectFirstSquare() {
    let selectedSquare = document.getElementById(`${this.playerCurrentSquare.squareId}`)
    console.dir(selectedSquare);
    selectedSquare.classList.add('selected')
  }

  revealSelected() {
    let lastSelected = document.querySelector('.selected')
    lastSelected.classList.remove('.selected')
    if (this.playerCurrentSquare.isItAMine) {
      let selectedSquare = document.getElementById(`${this.playerCurrentSquare.squareId}`)
      let m = document.createElement('p')
      m.innerText = 'M'
      selectedSquare.appendChild(m)
      m.parentNode.style.backgroundColor = 'black'
    }
  }

}


class Square {
  constructor(squareId, isItAMine, isItReavealed, sqarePlacement) {
    GameController.squareCount++
    this.squareId = `square${GameController.squareCount}`
    this.isItAMine = isItAMine
    this.isItReavealed = isItReavealed
    this.sqarePlacement = sqarePlacement

  }

}



class Player {
  constructor(health, points, game) {
    this.health = health
    this.points = points
    this.position = [7, 7]
    this.Square = null;
    this.game = game
  }

  async move(from, howManySpaces) {
    let fromSquare = this.game.map[from[0] - 1][from[1] - 1]
    let fromSquareIndex = []
    fromSquareIndex.push(fromSquare.sqarePlacement[0])
    fromSquareIndex.push(fromSquare.sqarePlacement[1])
    for (let i = 1; i <= howManySpaces; i++) {
      if (this.direction = 'froward') {
        if (fromSquareIndex[1] - 1 <= 0) {
          fromSquareIndex[0] = fromSquareIndex[0] - 1
          fromSquareIndex[1] = 7
          this.game.changePlayerCurrentPosition(fromSquareIndex)
          await sleep(500)
          if (i !== howManySpaces) {
            this.game.revealSelected()
          }
        } else {
          fromSquareIndex[1] = fromSquareIndex[1] - 1
          this.game.changePlayerCurrentPosition(fromSquareIndex)
          await sleep(500)
          if (i !== howManySpaces) {
            this.game.revealSelected()
          }
        }
      }

    }

  }

}


async function playGame() {
  const game = new GameController('easy')
  await sleep(1000)
  const player = new Player(3, 0, game)
  game.createMineMap()
  await game.createsDOMSquares()
  game.selectFirstSquare()
  await sleep(1000)
  player.move(game.playerCurrentPosition, 40)
}

playGame()