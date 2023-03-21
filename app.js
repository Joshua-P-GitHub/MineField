//DOM Variables
const gameArea = document.querySelector('.game-area')
const DOMSquare = document.querySelector('.square')
const dice = document.querySelector('#dice-number')
const diceScreen = document.querySelector('.dice')
const health = document.querySelector('.num-health')
const playerchosenNumber = document.querySelector('#player-number-choice')
const mines = document.querySelector('.num-mines')
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
    this.player = new Player(3, 0, this)
    health.innerText = this.player.health
    this.mines = 14
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

  changePlayerCurrentPosition(position) {
    let selectedSquare = document.getElementById(`${this.playerCurrentSquare.squareId}`)
    if (selectedSquare.classList.contains('selected')) {
      selectedSquare.classList.remove('selected')
    }
    if (!this.playerCurrentSquare.isItAMine) {
      this.revealSelected()
    }
    this.playerCurrentPosition = []
    this.playerCurrentPosition.push(position[0], position[1])
    this.playerCurrentSquare = this.map[this.playerCurrentPosition[0] - 1][this.playerCurrentPosition[1] - 1]
    selectedSquare = document.getElementById(`${this.playerCurrentSquare.squareId}`)
    selectedSquare.classList.add('selected')
  }

  async checkIfPlayerIsOnMine() {
    if (this.playerCurrentSquare.isItAMine) {
      diceScreen.style.display = 'none'
      let selectedSquare = document.getElementById(`${this.playerCurrentSquare.squareId}`)
      console.log(selectedSquare.childNodes.length)
      if (selectedSquare.childNodes.length <= 0) {
        console.log('ran');
        let m = document.createElement('p')
        m.innerText = 'M'
        selectedSquare.appendChild(m)
        m.parentNode.style.backgroundColor = 'black'
        this.mines--
        mines.innerText = this.mines
      }
      this.player.health -= 1
      health.innerText = `${this.player.health}`
      await sleep(1000)
      if (this.player.health <= 0) {
        this.clear()
        return
      }
      this.player.move(this.playerCurrentPosition, 1)
    } else {
      diceScreen.style.display = 'block'
    }
  }


  async rollDice() {
    this.player.checkIfLucky()
    let randomNum;
    for (let i = 0; i < 20; i++) {
      randomNum = Math.floor((Math.random() * 6) + 1)
      dice.innerText = randomNum
      await sleep(25)
      if (this.player.isLucky === true && i === 19 && !(playerchosenNumber.value === '')) {
        randomNum = playerchosenNumber.value
        dice.innerText = randomNum
      }
    }
    await sleep(1000)
    diceScreen.style.display = 'none'
    await this.player.move(this.playerCurrentPosition, randomNum)
    dice.addEventListener('click', startDice)
  }

  selectFirstSquare() {
    let selectedSquare = document.getElementById(`${this.playerCurrentSquare.squareId}`)
    console.log(this.playerCurrentSquare);
    selectedSquare.classList.add('selected')
  }

  revealSelected() {
    //let lastSelected = document.querySelector('.selected')
    //lastSelected.classList.remove('.selected')
    if (this.playerCurrentSquare.isItAMine) {
      let selectedSquare = document.getElementById(`${this.playerCurrentSquare.squareId}`)
      let m = document.createElement('p')
      m.innerText = 'M'
      selectedSquare.appendChild(m)
      m.parentNode.style.backgroundColor = 'black'
    } else {
      let selectedSquare = document.getElementById(`${this.playerCurrentSquare.squareId}`)
      if (!selectedSquare.classList.contains('selected')){
        selectedSquare.style.backgroundColor = 'blue'
      }

    }
  }



  displayDiceScreen() {
    diceScreen.style.display = 'block'
  }

  async clear() {
    GameController.squareCount = 0
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
    this.playerCurrentSquare = null;
    this.player = new Player(3, 0, this)
    health.innerText = this.player.health
    for (let i = 0; i < 49; i++) {
      gameArea.removeChild(gameArea.lastChild)
      await sleep(65)
    }

    this.newGame()
  }

  async newGame() {

    await sleep(1000)
    game.createMineMap()
    console.log(this.map)
    await game.createsDOMSquares()
    game.selectFirstSquare()
    await sleep(1000)
    game.displayDiceScreen()
    dice.addEventListener('click', startDice)

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
  constructor(health, points, game, luck) {
    this.health = health
    this.points = points
    this.position = [7, 7]
    this.Square = null;
    this.game = game
    this.luck = .99
    this.isLucky = false
  }

  async move(from, howManySpaces) {
    let fromSquare = this.game.map[from[0] - 1][from[1] - 1]
    let fromSquareIndex = []
    fromSquareIndex.push(fromSquare.sqarePlacement[0])
    fromSquareIndex.push(fromSquare.sqarePlacement[1])
    if (fromSquareIndex[0] === 1 && fromSquareIndex[1] < 6 && howManySpaces >= (fromSquareIndex[1] - 1)) {
      howManySpaces = fromSquareIndex[1] - 1
    }
    for (let i = 1; i <= howManySpaces; i++) {
      if (fromSquareIndex[1] - 1 <= 0) {
        fromSquareIndex[0] = fromSquareIndex[0] - 1
        fromSquareIndex[1] = 7
        this.position = [fromSquareIndex[0], fromSquareIndex[1]]
        this.game.changePlayerCurrentPosition(fromSquareIndex)
        await sleep(500)
        if (i != howManySpaces) {
          this.game.revealSelected()
        }
      } else {
        fromSquareIndex[1] = fromSquareIndex[1] - 1
        this.position = [fromSquareIndex[0], fromSquareIndex[1]]
        this.game.changePlayerCurrentPosition(fromSquareIndex)
        await sleep(500)
        if (i != howManySpaces) {
          console.log(i, ' ', howManySpaces)
          this.game.revealSelected()
        }
      }
    }
    if (this.position[0] === 1 && this.position[1] === 1) {
      this.game.clear()
    } else {
      this.game.checkIfPlayerIsOnMine()
    }
  }

  checkIfLucky() {
    if (Math.random() < this.luck) {
      this.isLucky = true
    }
    else {
      this.isLucky = false
    }
  }

}

async function startDice() {
  dice.removeEventListener('click', startDice)
  await game.rollDice()
}

let game = new GameController('easy')
game.newGame()
