'use strict'

//the update version 5:15 6/8/23!!!-FINAL !!!!!!!

var BOARD_SIZE = 14
var ALIEN_ROW_LENGTH = 8
var ALIEN_ROW_COUNT = 3

const ALIEN = 'ALIEN'
const LASER = 'LASER'
const GROUND = 'GROUND'
const SKY = 'SKY'
const CANDY = 'CANDY'
const BUNKER = 'BUNKER'


const GROUND_IMG = '🟫'
const ALIEN_IMG = '👽'
const ALIEN_IMG2 = '<img class="icon" src="photos/silly.png">'
const ALIEN_IMG3 = '<img class="icon" src="photos/alien3.png">'
const ALIEN_IMG4 = '<img class="icon" src="photos/alien4.png">'
const ALIEN_IMG5 = '<img class="icon" src="photos/alien5.png">'
const HERO_IMG2 = '<img class="icon" src="heros/1.png">'
const LASER_IMG = '❗'
const CANDY_IMG = '🍬'
const BUNKER_IMG = '<img class="icon" src="photos/bunker.png">'

const backgrounds = [
    'url("photos/g1.gif")',
    'url("photos/g2.gif")',
    'url("photos/g3.gif")',
    'url("photos/g4.gif")',
    'url("photos/giphy.gif")',
]

const heros = [
    'url("heros/1.png")',
    'url("heros/2.png")',
]

var gIsHeroIconChange = false

var gScore = 0
var gCountLives = 3
var gRecord = 0
var gBoard

var gIdCandyInterval = 0
var gIdCandyTimeout = 0

var gCurrBackgroundIdx = 0
var gCurrHeroIdx = 0

const gMainButton = document.querySelector('.mainButton')
const gSubButtons = document.querySelector('.subButtons')

var gGame = {
    isOn: false,
    alienCount: 0
}

function onInit() {
    gBoard = createBoard(BOARD_SIZE)
    createHero(gBoard)
    console.table(gBoard)
    renderBoard(gBoard)
    clearInterval(gIdCandyInterval)
    var newRecord = localStorage.getItem('record')
    var myRecord = document.querySelector('.Record span')
    myRecord.innerText = newRecord
}

function startGame() {
    if (gGame.isOn) return
    gGame.isOn = true
    playSound('theme')
    gIdCandyInterval = setInterval(spaceCandies, 10000)
}

function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject
    }
}

function createBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = { type: SKY, gameObject: null }
            if (i === size - 1) {
                board[i][j].type = GROUND
            }
        }
    }
    board = putAliensInBoard(size, board)
    return board
}

function putAliensInBoard(size, board) {
    for (var i = 0; i < ALIEN_ROW_COUNT; i++) {
        for (var j = size - ALIEN_ROW_LENGTH; j < size; j++) {
            board[i][j].gameObject = ALIEN
            gCountAliens++
        }
    }
    return board
}

function updateScore(count) {
    var elScore = document.querySelector('h4 span')
    elScore.innerText = count
}

function isVictory() {
    var msgModal = 'You Win!'
    playSound('claps')
    openModal(msgModal)
    clearInterval(gIdShootInterval)
    clearInterval(gIdCandyInterval)
    clearInterval(gIdCandyTimeout)
    gGame.isOn = false
    compareScoreToRecrod()
}

function compareScoreToRecrod() {
    if (gScore > gRecord) gRecord = gScore
    localStorage.setItem('record', gRecord)
}

function restart() {
    closeModal()
    gScore = 0
    updateScore(gScore)
    gCountAliens = 0
    clearInterval(gIdShootInterval)
    clearInterval(gIdCandyInterval)
    clearInterval(gIdCandyTimeout)
    onInit()
}

function spaceCandies() {
    var randomJ = getRandomIntInclusive(0, BOARD_SIZE - 1)
    if (gBoard[BOARD_SIZE - 2][randomJ].gameObject === HERO) {
        randomJ = getRandomIntInclusive(0, BOARD_SIZE - 1)
    } else {
        gBoard[BOARD_SIZE - 2][randomJ].gameObject = CANDY
        updateCell({ i: BOARD_SIZE - 2, j: randomJ }, CANDY_IMG)
        gIdCandyTimeout = setTimeout(() => {
            gBoard[BOARD_SIZE - 2][randomJ].gameObject = null
            updateCell({ i: BOARD_SIZE - 2, j: randomJ }, '')
        }, 5000);
    }
}

function handleCandleHit(prevItem) {
    if (prevItem.gameObject === '🍬') {
        gScore += 50
        playSound('Yummy')
        updateScore(gScore)
    }
}

gMainButton.addEventListener('click', () => {
    gSubButtons.classList.toggle('show')
})

function chooseTheme() {
    const body = document.querySelector('body')
    gCurrBackgroundIdx = (gCurrBackgroundIdx + 1) % backgrounds.length
    body.style.backgroundImage = backgrounds[gCurrBackgroundIdx]
}

function chooseHero() {
    gIsHeroIconChange = true
    if (gGame.isOn) return;
    gCurrHeroIdx = (gCurrHeroIdx + 1) % heros.length;
    var HERO_IMG = heros[gCurrHeroIdx];
    HERO_IMG = `<img class="icon" src="${HERO_IMG}">`;
    updateCell({ i: BOARD_SIZE - 2, j: gMiddleLocationHero - 1 }, HERO_IMG);
    return HERO_IMG
}

function changeLevel(level) {
    if (gGame.isOn) {
        alert('You cant change level during playing!')
        return
    }
    if (level === 1) {
        ALIEN_ROW_LENGTH = 4
        ALIEN_SPEED = 200
    } else if (level === 2) {
        ALIEN_ROW_LENGTH = 8
        ALIEN_SPEED = 500
    } else if (level === 3) {
        ALIEN_ROW_LENGTH = 12
        ALIEN_SPEED = 1000
    }
    gCountAliens = 0
    onInit()
}