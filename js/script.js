// declaring "cards" for all with the class of "moodiez-card"
const cards = document.querySelectorAll(".moodiez-card")

// default values
let flippedCard = false
let firstCard = ""
let secondCard = ""
let doubleClick = false
const startButton = document.getElementById("start-button")
const title = document.getElementById("titleText")
const subTitle = document.getElementById("subTitle")
const instructions = document.getElementById("instructions")
const player1 = document.getElementById("player1")
const player2 = document.getElementById("player2")
let player1Score = document.getElementById("player1Score")
let player2Score = document.getElementById("player2Score")
const game = document.getElementById("moodiez-board")
let flippedCards = document.getElementsByClassName("flipped")
const player1Wins = document.getElementById("player1win")
const player2Wins = document.getElementById("player2win")
const draw = document.getElementById("draw")
const playAgain = document.getElementById("playagain")
const player1Turn = document.getElementById("player1Turn")
const player2Turn = document.getElementById("player2Turn")

// start button that hides the landing page and shows the actual game
startButton.addEventListener("click", () => {
    title.style.display = "none";
    startButton.style.display = "none";
    subTitle.style.display = "none";
    instructions.style.display = "none";
    player1.style.display = "inline";
    player2.style.display = "inline";
    player1Score.style.display = "inline";
    player2Score.style.display = "inline";
    game.style.display = "flex";
    player1Turn.style.display = "block";
})

// player default values
let players = ["Player 1", "Player 2"]
let currentPlayer = 0
let scores = {
    "Player 1": 0,
    "Player 2": 0,
}

// decide who's turn it is and to change turns
function playerTurn() {
    if (currentPlayer === 0) {
        currentPlayer = 1
        player2.style.color = "rgb(0, 0, 0)"
        player2.style.backgroundColor = "rgba(255, 255, 255, 0.80)"
        player2.style.border = "rgb(0, 0, 0) solid 5px"
        player1Turn.style.display = "none"
        player2Turn.style.display = "block"
    } else {
        currentPlayer = 0
        player1.style.color = "rgb(0, 0, 0)"
        player1.style.backgroundColor = "rgba(255, 255, 255, 0.80)"
        player1.style.border = "rgb(0, 0, 0) solid 5px"
        player2Turn.style.display = "none"
        player1Turn.style.display = "block"
    }
    flash = false
    currentPlayerStyle()
}

// edit the CSS of the current player's turn to flash back and forth
let flash = false
function currentPlayerStyle () {
    if (currentPlayer ===  0) {
        flashInterval = setInterval(() => {
            if (flash) {
                player1.style.color = "rgb(255, 255, 255)"
                player1.style.backgroundColor = "rgba(0, 0, 0, 0.80)"
                player1.style.border = "rgb(255, 255, 255) solid 5px"
                // changing the value of "flash" so the next part of the function with iterate
                flash = false
            } else {
                player1.style.color = "rgb(0, 0, 0)"
                player1.style.backgroundColor = "rgba(255, 255, 255, 0.80)"
                player1.style.border = "rgb(0, 0, 0) solid 5px"
                // changing the value of "flash" back so it will loop infinitely
                flash = true
            }
        }, 750)
    } else {
        flashInterval = setInterval(() => {
            if (flash) {
                player2.style.color = "rgb(255, 255, 255)"
                player2.style.backgroundColor = "rgba(0, 0, 0, 0.80)"
                player2.style.border = "rgb(255, 255, 255) solid 5px"
                flash = false
            } else {
                player2.style.color = "rgb(0, 0, 0)"
                player2.style.backgroundColor = "rgba(255, 255, 255, 0.80)"
                player2.style.border = "rgb(0, 0, 0) solid 5px"
                flash = true
            }
        }, 750)
    }
}

// display the current player's turn
currentPlayerStyle()

// display the current score of each player
function updateScores() {
    player1Score.innerHTML = `${scores[players[0]]}`
    player2Score.innerHTML = `${scores[players[1]]}`
}

// starts both players at 0
updateScores()

// comparing the player's scores to see who wins
function gameWinner() {
    if (scores[players[0]] > scores[players[1]]) {
        player1Wins.style.display = "block"
        playAgain.style.display = "block"
    } else if (scores[players[0]] < scores[players[1]]) {
        player2Wins.style.display = "block"
        playAgain.style.display = "block"
    } else {
        draw.style.display = "block"
        playAgain.style.display = "block"
    }
}
// ending the game once all cards contain the class of "flipped"
function gameOver() {
    if (cards.length === flippedCards.length) {
        gameWinner()
    }
}
// function for flipping cards
function flipCard() {
    // stopping the player from flipping more than 2 cards at once, breaking the setTimeout logic
    if (doubleClick === true)
    return
    // stopping the player from flipping back the card they have chosen, the card they flip back face-down is matching itself, breaking the dataset.match logic
    if (this === firstCard) 
    return
    
    // toggling/adding the class "flipped"
    this.classList.toggle("flipped")
    
    // conditionals
    if (!flippedCard) {
        // first click
        flippedCard = true
        firstCard = this
    } else {
        // second click
        flippedCard = false
        secondCard = this
        
        // checking if the "firstCard" matches the "secondCard" using the custom dataset in HTML
        if (firstCard.dataset.match === secondCard.dataset.match) {
            // if so, they cannot be clicked again(cards stay face up)
            firstCard.removeEventListener("click", flipCard);
            secondCard.removeEventListener("click", flipCard)
            // adding 1 point to the current player
            scores[players[currentPlayer]] += 1
            updateScores()
            gameOver()
        } else {
            // allowing the player to flip 2 cards that don't match
            doubleClick = true
            // if not, remove the toggled/added class "flipped"(cards turn back face down) after a set amount of time
            setTimeout(() => {
                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped")
                // stopping the player from flipping a 3rd+ card & "resets" the unmatched cards 
                reClick()
            }, 3000)
            // stopping the player change until after the cards have flipped face-down
            setTimeout(() => {
                clearInterval(flashInterval)
                // because the cards do not match, it is the other player's turn
                playerTurn()
            }, 3000)
        }
    }
}

// "resets" the unmatched cards so that the firstCard can be clicked again as the firstCard on the next turn
function reClick() {
    flippedCard = false;
    doubleClick = false;
    firstCard = null;
}

// function to shuffle the cards on the board
(function shuffleBoard() {
    // apply to each card
    cards.forEach(card => {
        // assigns a random, whole integer from 0-35
        let randomCardNumber = Math.floor(Math.random() * 36)
        // uses the flex property in CSS to order the cards numerically after they ahve been assigned random numbers
        card.style.order = randomCardNumber
    })
})()

// listening for a "click" on all "cards" and calling the "flipCard" fuction when that occurs
cards.forEach(card => card.addEventListener("click", flipCard))