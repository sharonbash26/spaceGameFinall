'use strict'


function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cellData = `data-i='${i}' data-j='${j}'`
            const cellClass = board[i][j].type
            var cellObject = board[i][j].gameObject || ''
            if (i === gAliensTopRowIdx) {
                if (cellObject === ALIEN) cellObject = ALIEN_IMG4
            }
            else if (i === gAliensTopRowIdx+1) {
                if (cellObject === ALIEN) cellObject = ALIEN_IMG2
            }
            else if (i ===gAliensBottomRowIdx ) {
                if (cellObject === ALIEN) cellObject = ALIEN_IMG3
            }
            if (cellClass === GROUND) cellObject = GROUND_IMG
            else if (cellObject === HERO) cellObject = HERO_IMG
            strHTML += `<td class="${cellClass}" ${cellData}>${cellObject} </td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('table')
    elBoard.innerHTML = strHTML
}


function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject
    var elCell = getElCell(pos)
    elCell.innerHTML = gameObject || ''
}

function getElCell(pos) {
    return document.querySelector(`[data-i='${pos.i}'][data-j='${pos.j}']`)
}

function openModal(msg) {
    var elModal = document.querySelector('.modal')
    var elMsg = elModal.querySelector('.msg')
    elMsg.innerText = msg
    elModal.style.display = 'block'
}
// function changeTextInBtn(msg){
//     var elBtn=document.querySelector('.restart-btn')
//     elBtn.innerText=msg
// }

function closeModal() {
    var elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
}


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is inclusive and the minimum is inclusive
}


function playSound(fileName) {
    var sound = new Audio(`sound/${fileName}.mp3`)
    sound.play()
    
}

function getRandNum(nums) {
    var randIdx = getRandomIntInclusive(0, nums.length) // 4
    var num = nums[randIdx] // 5
    nums.splice(randIdx, 1)// [1,2,3,4,6,7...]
    return num
}
