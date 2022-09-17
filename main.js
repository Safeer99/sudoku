const tiles = document.querySelectorAll('.tile')
const numbersBtn = document.querySelectorAll('.number')
const scroller = document.querySelector('.scroller')
const pauseBtn = document.querySelector('.pause')
const resumeBtn = document.getElementById('resume')
const quitBtn = document.getElementById('quit')

let solution = [];
let mode = "easy";
let numberActivated = false;
let selectedNumber = 0;
let startTimer = false;
let time = {
    minutes: 0,
    seconds: 0
};

let boardArray = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
]

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function intToStringConverter() {
    if (time.seconds < 10) {
        return time.minutes < 10
            ? '0' + time.minutes.toString() + ':0' + time.seconds.toString()
            : time.minutes.toString() + ':0' + time.seconds.toString()
    } else if (time.minutes < 10) {
        return '0' + time.minutes.toString() + ':' + time.seconds.toString()
    } else {
        return time.minutes.toString() + ':' + time.seconds.toString()
    }
}

setInterval(() => {
    if (startTimer && time.minutes < 60) {
        time.seconds++;
        if (time.seconds === 60) {
            time.minutes++;
            time.seconds = 0;
        }
        document.querySelector('.timer').innerHTML = intToStringConverter();
    }
}, 1000);

window.onload = function () {
    for (let i = 0; i < 81; i++) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        if (row === 2 || row === 5) {
            tiles[i].style.marginBottom = "5px"
        }
        if (col === 2 || col === 5) {
            tiles[i].style.marginRight = "5px"
        }
    }
}

//? checking in columns for duplicate
function colSafe(col, value) {
    for (let row = 0; row < boardArray.length; row++) {
        if (boardArray[row][col] === value) return false;
    }
    return true;
}

//? checking in rows for duplicate
function rowSafe(row, value) {
    for (let col = 0; col < boardArray.length; col++) {
        if (boardArray[row][col] === value) return false;
    }
    return true;
}

//? checking in 3X3 box for duplicate
function boxSafe(boxRow, boxCol, value) {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (boardArray[row + Math.floor(boxRow / 3) * 3][col + Math.floor(boxCol / 3) * 3] === value) return false;
        }
    }
    return true;
}

function isSafe(row, col, value) {
    return rowSafe(row, value) && colSafe(col, value) && boxSafe(row, col, value);
}

function shuffleArray(arr) {
    let array = arr;
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function generateSudoku() {
    let numbersArray = shuffleArray(arr);
    for (let row = 0; row < boardArray.length; row++) {
        for (let col = 0; col < boardArray[row].length; col++) {
            if (boardArray[row][col] === 0) {
                for (let value = 0; value < numbersArray.length; value++) {
                    if (isSafe(row, col, numbersArray[value])) {
                        boardArray[row][col] = numbersArray[value];
                        if (generateSudoku()) {
                            return true;
                        }
                        boardArray[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function removeNumbers(removingCount) {
    //? removing random n nummbers
    for (let i = 0; i < removingCount; i++) {
        let found = false;
        while (!found) {
            const x = Math.floor(Math.random() * 9);
            const y = Math.floor(Math.random() * 9);
            if (boardArray[x][y] !== 0) {
                boardArray[x][y] = 0;
                found = true;
            }
        }
    }
    //? adding bold class to removed numbers and remove pointerEvents from rest
    for (let i = 0; i < 81; i++) {
        if (boardArray[Math.floor(i / 9)][i % 9] !== 0) {
            tiles[i].innerHTML = boardArray[Math.floor(i / 9)][i % 9]
            tiles[i].style.pointerEvents = 'none'
        } else {
            tiles[i].innerHTML = ''
            tiles[i].classList.add('bold')
        }
    }
}

function addRemoveAnimation() {
    tiles.forEach(tile => {
        if (tile.innerHTML === selectedNumber && numberActivated) {
            tile.classList.add('active')
        } else {
            tile.classList.remove('active')
        }
    })
    numbersBtn.forEach(btn => {
        if (selectedNumber === btn.innerHTML) {
            btn.classList.add('active')
        } else {
            btn.classList.remove('active')
        }
    })
}

numbersBtn.forEach(n => {
    n.addEventListener('click', () => {
        if (numberActivated && n.innerHTML === selectedNumber) {
            numberActivated = false;
            selectedNumber = 0;
        } else {
            numberActivated = true;
            selectedNumber = n.innerHTML;
        }
        addRemoveAnimation();
    })
})

tiles.forEach(tile => {
    tile.addEventListener('click', () => {
        if (selectedNumber === 'X') {
            tile.innerHTML = ''
            tile.classList.remove('active')
        } else if (tile.style.pointerEvents !== 'none' && numberActivated && tile.innerHTML !== selectedNumber) {
            tile.innerHTML = selectedNumber;
            tile.classList.add('active')
        } else if (tile.innerHTML === selectedNumber && numberActivated) {
            tile.innerHTML = ''
            tile.classList.remove('active')
        }
    })
})

//? mode scroller previous button
document.querySelector('.previous').addEventListener('click', () => {
    if (mode === "extreme") {
        mode = "hard"
        scroller.classList.remove('extreme')
        scroller.classList.add('hard');
    } else if (mode === "hard") {
        mode = "medium"
        scroller.classList.remove('hard')
        scroller.classList.add('medium');
    } else if (mode === "medium") {
        mode = "easy"
        scroller.classList.remove('medium')
    }
})

//? mode scroller next button
document.querySelector('.next').addEventListener('click', () => {
    if (mode === "easy") {
        mode = "medium"
        scroller.classList.add('medium');
    } else if (mode === "medium") {
        mode = "hard"
        scroller.classList.remove('medium')
        scroller.classList.add('hard');
    } else if (mode === "hard") {
        mode = "extreme"
        scroller.classList.remove('hard')
        scroller.classList.add('extreme');
    }
})

//? starting the game
document.getElementById('start').addEventListener('click', () => {
    //? resetting the classes and board
    time.minutes = time.seconds = 0;
    boardArray = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
    tiles.forEach(tile => {
        tile.classList.remove('bold')
        tile.classList.remove('active')
    })
    document.querySelector('.box').classList.add('sideScrollMainPage')
    document.querySelector('.startPage').classList.add('sideScrollStartPage')
    generateSudoku();
    solution = JSON.parse(JSON.stringify(boardArray));
    switch (mode) {
        case "easy": removeNumbers(25);
            break;

        case "medium": removeNumbers(35);
            break;

        case "hard": removeNumbers(45);
            break;

        case "extreme": removeNumbers(55);
            break;
    }
    startTimer = true;
})

//? pause game functionality
pauseBtn.addEventListener("click", () => {
    startTimer = false;
    document.querySelector('.pausePage').classList.add('appear')
})

resumeBtn.addEventListener("click", () => {
    startTimer = true;
    document.querySelector('.pausePage').classList.remove('appear')
})

quitBtn.addEventListener('click', () => {
    startTimer = false;
    document.querySelector('.pausePage').classList.remove('appear')
    document.querySelector('.box').classList.remove('sideScrollMainPage')
    document.querySelector('.startPage').classList.remove('sideScrollStartPage')
})

function checkSudoku() {
    let c = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (solution[i][j] !== parseInt(tiles[c++].innerHTML)) {
                return false;
            }
        }
    }
    return true;
}

document.querySelector('.check').addEventListener('click', () => {
    if (checkSudoku()) {
        startTimer = false;
        tiles.forEach(tile => {
            tile.classList.remove('active')
            tile.classList.remove('bold')
            tile.style.pointerEvents = 'none'
        })
        numbersBtn.forEach(btn => {
            btn.classList.remove('active')
            btn.style.pointerEvents = 'none'
        })
        document.querySelector('.pause').style.display = 'none'
        document.querySelector('.check').style.display = 'none'
        document.querySelector('.back').style.display = 'block'
    } else {
        document.querySelector('.box').classList.add('boxShaking')
        setTimeout(() => {
            document.querySelector('.box').classList.remove('boxShaking')
        }, 1000);
    }
})

document.querySelector('.back').addEventListener('click', () => {
    document.querySelector('.box').classList.remove('sideScrollMainPage')
    document.querySelector('.startPage').classList.remove('sideScrollStartPage')
    document.querySelector('.pause').style.display = 'block'
    document.querySelector('.check').style.display = 'block'
    document.querySelector('.back').style.display = 'none'
})