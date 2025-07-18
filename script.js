// Get references to HTML elements
const gameBoard = document.getElementById('game-board');
const rollDiceBtn = document.getElementById('roll-dice-btn');
const currentRollSpan = document.getElementById('current-roll');
const playerPositionSpan = document.getElementById('player-position');
const messageArea = document.getElementById('message-area');
const quizModal = document.getElementById('quiz-modal');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizTimerDisplay = document.getElementById('quiz-timer');

// NEW: Reference to the main game container for scaling
const gameContainer = document.getElementById('game-container'); // This is crucial!

// Game state variables
const boardSize = 100; // Total number of squares on the board
let playerPosition = 1; // Player starts at logical square 1

// Quiz Timer Variables
const quizTimeLimit = 15; // Time limit for each quiz in seconds
let currentQuizTimer;     // Stores the current remaining time
let quizInterval;         // Stores the setInterval ID to clear the timer later

// Global variable for available quiz questions
let availableQuizQuestions = [];

// Sound Objects
const diceRollSound = new Audio('sounds/diceroll.wav');
const snakeHissSound = new Audio('sounds/snakehiss.mp3');
const correctSound = new Audio('sounds/correct.wav');
const incorrectSound = new Audio('sounds/incorrect.mp3');
const winSound = new Audio('sounds/win.play');
const loseSound = new Audio('sounds/lose.play'); // For time's up or unexpected game over
const backgroundMusic = new Audio('sounds/background_music.mp3');

// Optional: Set volume for each sound
diceRollSound.volume = 0.7;
snakeHissSound.volume = 0.8;
correctSound.volume = 0.6;
incorrectSound.volume = 0.8;
winSound.volume = 0.9;
loseSound.volume = 0.9;
backgroundMusic.volume = 0.4; // Keep background music lower

// Make background music loop
backgroundMusic.loop = true;
let isMusicPlaying = false; // Flag to track if music has started

// Define snake head and tail positions (you can add more or adjust these)
const snakes = {
    16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78,
    3: 1, 6: 2, 8: 4, 11: 7, 14: 9, 31: 22, 37: 28, 39: 29, 45: 32, 52: 43, 54: 44,
    71: 58, 77: 66, 85: 72
};

// Quiz data (your custom questions)
const quizData = [
    { "question": "Which of the following is considered one of the 'Big Four' venomous snakes in India?", "options": ["Rat Snake", "Common Krait", "Green Vine Snake", "Indian Rock Python"], "answer": "Common Krait" },
    { "question": "What is the primary type of venom produced by the Common Krait?", "options": ["Hemotoxic", "Cytotoxic", "Neurotoxic", "Myotoxic"], "answer": "Neurotoxic" },
    { "question": "Which snake is famous for its 'spectacle' marking on the hood?", "options": ["Russell's Viper", "Saw-scaled Viper", "Indian Cobra", "King Cobra"], "answer": "Indian Cobra" },
    { "question": "Where would you most likely find a King Cobra in India?", "options": ["Thar Desert", "Himalayan Foothills", "Coastal Saline Marshes", "Urban Residential Areas"], "answer": "Himalayan Foothills" },
    { "question": "Which of these Indian snakes is known for its aggressive defensive display, including coiling and hissing loudly?", "options": ["Indian Python", "Common Sand Boa", "Russell's Viper", "Trinket Snake"], "answer": "Russell's Viper" },
    { "question": "What is the main diet of the King Cobra?", "options": ["Rodents", "Birds", "Other Snakes", "Frogs"], "answer": "Other Snakes" },
    { "question": "Which Indian state has a high diversity of snake species due to its varied ecosystems?", "options": ["Rajasthan", "Punjab", "Kerala", "Haryana"], "answer": "Kerala" },
    { "question": "What is the primary characteristic that distinguishes a venomous snake from a non-venomous one (though not always reliable)?", "options": ["Head Shape", "Pupil Shape", "Presence of Fangs", "Size and Length"], "answer": "Presence of Fangs" },
    { "question": "Which of the following non-venomous snakes is often confused with venomous ones due to its markings or behavior?", "options": ["Rat Snake", "Common Wolf Snake", "Indian Python", "Trinket Snake"], "answer": "Rat Snake" },
    { "question": "What is the purpose of snake venom?", "options": ["Self-defense only", "Digestion only", "Immobilizing prey and defense", "Attracting mates"], "answer": "Immobilizing prey and defense" },
    { "question": "Which Indian snake is viviparous, meaning it gives birth to live young?", "options": ["Indian Cobra", "Common Krait", "Russell's Viper", "Rat Snake"], "answer": "Russell's Viper" },
    { "question": "What is the conservation status of the Indian Rock Python?", "options": ["Least Concern", "Critically Endangered", "Vulnerable", "Extinct in the Wild"], "answer": "Vulnerable" },
    { "question": "Which type of snakebite typically causes localized pain, swelling, and tissue necrosis?", "options": ["Neurotoxic", "Hemotoxic/Cytotoxic", "Myotoxic", "Cardiotoxic"], "answer": "Hemotoxic/Cytotoxic" },
    { "question": "What is the common name for the snake species 'Echis carinatus'?", "options": ["Indian Cobra", "Common Krait", "Russell's Viper", "Saw-scaled Viper"], "answer": "Saw-scaled Viper" },
    { "question": "Which of these practices is NOT recommended if you encounter a snake?", "options": ["Maintain a safe distance", "Try to catch or kill it", "Walk away slowly", "Alert professionals if it's in a residential area"], "answer": "Try to catch or kill it" },
    { "question": "What is the primary habitat of the Common Krait in India?", "options": ["Deep Forests", "Arid Deserts", "Agricultural fields and human settlements", "High Altitude Mountains"], "answer": "Agricultural fields and human settlements" },
    { "question": "Which of the 'Big Four' is responsible for the highest number of snakebite fatalities in India?", "options": ["Indian Cobra", "Common Krait", "Russell's Viper", "Saw-scaled Viper"], "answer": "Russell's Viper" },
    { "question": "What is the scientific term for shedding of skin by snakes?", "options": ["Hibernation", "Estivation", "Ecdysis", "Metamorphosis"], "answer": "Ecdysis" },
    { "question": "Which snake species in India is known to be arboreal (tree-dwelling) and has a distinct green coloration?", "options": ["Indian Rat Snake", "Green Pit Viper", "Common Krait", "Banded Racer"], "answer": "Green Pit Viper" },
    { "question": "What is the main reason for the decline in snake populations in India?", "options": ["Over-hunting by predators", "Climate change causing colder winters", "Habitat loss and human-wildlife conflict", "Increased awareness leading to more snake rescues"], "answer": "Habitat loss and human-wildlife conflict" }
];

/**
 * Helper function to map a logical square number (1-100) to its DOM element index (0-99).
 * This is crucial for correctly positioning the player token on the zig-zag board,
 * as the HTML `gameBoard.children` order does not directly match the logical 1-100 sequence.
 * @param {number} logicalPos The logical square number (1 to 100).
 * @returns {number} The 0-indexed position in the gameBoard.children HTMLCollection.
 */
function logicalToDomIndex(logicalPos) {
    const rowFromBottom = Math.floor((logicalPos - 1) / 10);
    const colInLogicalRow = (logicalPos - 1) % 10;
    let domColIndex;
    if (rowFromBottom % 2 === 0) {
        domColIndex = colInLogicalRow;
    } else {
        domColIndex = 9 - colInLogicalRow;
    }
    const domRowIndex = 9 - rowFromBottom;
    const domIndex = domRowIndex * 10 + domColIndex;
    return domIndex;
}

// Function to create the game board squares
function createBoard() {
    gameBoard.innerHTML = '';
    const squaresInLogicalOrder = [];

    for (let i = 1; i <= boardSize; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.dataset.number = i;
        square.innerHTML = i;

        const rowFromBottom = Math.floor((i - 1) / 10);
        const colInLogicalRow = (i - 1) % 10;

        let visualColIndex;
        if (rowFromBottom % 2 === 0) {
            visualColIndex = colInLogicalRow;
        } else {
            visualColIndex = 9 - colInLogicalRow;
        }

        if ((rowFromBottom + visualColIndex) % 2 === 0) {
            square.classList.add('lighter-square');
        } else {
            square.classList.add('darker-square');
        }

        if (snakes[i]) {
            square.classList.add('snake-head');
            square.innerHTML += ' 🐍';
        }

        if (i === boardSize) {
            square.innerHTML += ' 🏆';
            square.classList.add('win-square');
        }

        squaresInLogicalOrder.push(square);
    }

    const finalDomOrder = new Array(boardSize);
    for (let logicalNum = 1; logicalNum <= boardSize; logicalNum++) {
        const domIdx = logicalToDomIndex(logicalNum);
        finalDomOrder[domIdx] = squaresInLogicalOrder[logicalNum - 1];
    }
    finalDomOrder.forEach(square => gameBoard.appendChild(square));
}

// Player Token Initialization and Movement
let playerToken; // Declare playerToken globally

function initializePlayerToken() {
    if (!playerToken) {
        playerToken = document.createElement('div');
        playerToken.classList.add('player');
        gameBoard.appendChild(playerToken);
    }
    updatePlayerPositionDisplay();
    movePlayerToken(); // Move the token to the initial square (logical 1)
}


// Function to display messages to the user
function displayMessage(msg) {
    messageArea.textContent = msg;
}

// Function to update the player's position text display
function updatePlayerPositionDisplay() {
    playerPositionSpan.textContent = playerPosition;
}

// Function to visually move the player token on the board
function movePlayerToken() {
    const targetDomIndex = logicalToDomIndex(playerPosition);
    const targetSquare = gameBoard.children[targetDomIndex];

    if (targetSquare) {
        // Get the current computed style of the game board
        const boardComputedStyle = window.getComputedStyle(gameBoard);
        const boardWidth = parseFloat(boardComputedStyle.width); // Get scaled board width
        const boardHeight = parseFloat(boardComputedStyle.height); // Get scaled board height

        // Calculate actual square size based on current board dimensions
        const squareWidth = boardWidth / 10; // Assuming 10 columns
        const squareHeight = boardHeight / 10; // Assuming 10 rows

        // Set player token size based on current square size (e.g., 60% of square size)
        const playerSize = squareWidth * 0.6; // Adjust this factor as needed (e.g., 0.8 for 80%)
        playerToken.style.width = `${playerSize}px`;
        playerToken.style.height = `${playerSize}px`;

        // Calculate positions relative to the game board
        // No need for getBoundingClientRect() if using percentage/grid units consistently
        // Instead, calculate based on the current square's position within the grid
        const colIndex = targetDomIndex % 10;
        const rowIndex = Math.floor(targetDomIndex / 10);

        // Calculate the center of the square based on its grid position
        playerToken.style.left = `${colIndex * squareWidth + (squareWidth / 2)}px`;
        playerToken.style.top = `${rowIndex * squareHeight + (squareHeight / 2)}px`;
    }
}


// Function to roll the dice and move the player
function rollDice() {
    // Play background music on first interaction
    if (!isMusicPlaying) {
        backgroundMusic.play().catch(e => console.log("Background music autoplay blocked:", e));
        isMusicPlaying = true;
    }

    rollDiceBtn.disabled = true;
    displayMessage("Rolling dice...");
    diceRollSound.play();

    const roll = Math.floor(Math.random() * 6) + 1;
    currentRollSpan.textContent = roll;

    let newPosition = playerPosition + roll;

    if (newPosition > boardSize) {
        displayMessage(`You rolled a ${roll}! You need exactly ${boardSize - playerPosition} to win. Stay put.`);
        rollDiceBtn.disabled = false;
        return;
    }

    displayMessage(`You rolled a ${roll}! Moving from ${playerPosition} to ${newPosition}.`);

    let animationPosition = playerPosition;
    const interval = setInterval(() => {
        animationPosition++;
        if (animationPosition <= newPosition) {
            playerPosition = animationPosition;
            updatePlayerPositionDisplay();
            movePlayerToken();
        } else {
            clearInterval(interval);
            checkLanding(newPosition);
        }
    }, 200);
}

// Function to check if player landed on a special square or won
function checkLanding(finalPosition) {
    playerPosition = finalPosition;
    updatePlayerPositionDisplay(); // Ensure display is updated right after final position

    if (playerPosition === boardSize) {
        displayMessage("Congratulations! You've reached square 100 and won!");
        winSound.play();
        rollDiceBtn.disabled = true;
        backgroundMusic.pause();
    } else if (snakes[playerPosition]) {
        displayMessage(`Oh no! You landed on a snake at ${playerPosition}! Answer a question to save yourself!`);
        showQuiz();
    } else {
        rollDiceBtn.disabled = false;
    }
}

// Quiz Functions
let currentQuizQuestion = {};

function resetQuizPool() {
    availableQuizQuestions = [...quizData];
    for (let i = availableQuizQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableQuizQuestions[i], availableQuizQuestions[j]] = [availableQuizQuestions[j], availableQuizQuestions[i]];
    }
}

function showQuiz() {
    quizModal.classList.remove('hidden');
    rollDiceBtn.disabled = true;

    if (availableQuizQuestions.length === 0) {
        resetQuizPool();
        displayMessage("All unique questions asked! Resetting quiz pool.");
    }

    const randomIndex = Math.floor(Math.random() * availableQuizQuestions.length);
    currentQuizQuestion = availableQuizQuestions[randomIndex];
    availableQuizQuestions.splice(randomIndex, 1);

    quizTimerDisplay.style.display = 'block';
    currentQuizTimer = quizTimeLimit;
    quizTimerDisplay.textContent = `Time: ${currentQuizTimer}s`;
    quizTimerDisplay.style.color = '';

    if (quizInterval) {
        clearInterval(quizInterval);
    }

    quizInterval = setInterval(() => {
        currentQuizTimer--;
        quizTimerDisplay.textContent = `Time: ${currentQuizTimer}s`;

        if (currentQuizTimer <= 5) {
            quizTimerDisplay.style.color = 'red';
        }

        if (currentQuizTimer <= 0) {
            clearInterval(quizInterval);
            handleTimeUp();
        }
    }, 1000);

    quizQuestion.textContent = currentQuizQuestion.question;

    quizOptions.innerHTML = '';

    currentQuizQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option));
        quizOptions.appendChild(button);
    });
}

function checkAnswer(selectedOption) {
    clearInterval(quizInterval);
    quizTimerDisplay.style.display = 'none';
    quizTimerDisplay.style.color = '';

    if (selectedOption === currentQuizQuestion.answer) {
        correctSound.play();
        let bonusMessage = "Correct! You avoided the snake!";
        if (currentQuizTimer > 0) {
            playerPosition += 1;
            bonusMessage = `Correct! You avoided the snake and moved forward 1 square to ${playerPosition}!`;
        }
        displayMessage(bonusMessage);
        updatePlayerPositionDisplay();
        movePlayerToken();
        hideQuiz();
        rollDiceBtn.disabled = false;
    } else {
        incorrectSound.play();
        snakeHissSound.play();
        displayMessage(`Incorrect! The answer was "${currentQuizQuestion.answer}". You slide back to ${snakes[playerPosition]}!`);
        playerPosition = snakes[playerPosition];
        updatePlayerPositionDisplay();
        movePlayerToken();
        hideQuiz();
        rollDiceBtn.disabled = false;
    }
}

function handleTimeUp() {
    quizTimerDisplay.style.display = 'none';
    quizTimerDisplay.style.color = '';
    incorrectSound.play();
    snakeHissSound.play();

    displayMessage(`Time's up! The answer was "${currentQuizQuestion.answer}". You slide back to ${snakes[playerPosition]}!`);
    playerPosition = snakes[playerPosition];
    updatePlayerPositionDisplay();
    movePlayerToken();
    hideQuiz();
    rollDiceBtn.disabled = false;
}

function hideQuiz() {
    quizModal.classList.add('hidden');
    if (quizInterval) {
        clearInterval(quizInterval);
    }
    quizTimerDisplay.style.display = 'none';
    quizTimerDisplay.style.color = '';
}

// NEW: Define base dimensions of your game (from your design)
const BASE_GAME_WIDTH = 1280; // Your target design width
const BASE_GAME_HEIGHT = 720; // Your target design height

// NEW: Function to resize the game container based on viewport
function resizeGame() {
    // Get current window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate aspect ratios
    const gameAspectRatio = BASE_GAME_WIDTH / BASE_GAME_HEIGHT;
    const windowAspectRatio = windowWidth / windowHeight;

    let newWidth;
    let newHeight;

    if (windowAspectRatio > gameAspectRatio) {
        // Window is wider than the game, constrain by height
        newHeight = windowHeight;
        newWidth = newHeight * gameAspectRatio;
    } else {
        // Window is taller (or same aspect) as the game, constrain by width
        newWidth = windowWidth;
        newHeight = newWidth / gameAspectRatio;
    }

    // Apply the new dimensions to the game container
    gameContainer.style.width = `${newWidth}px`;
    gameContainer.style.height = `${newHeight}px`;

    // Important: After resizing the container, re-position the player token
    // This ensures the player token is correctly sized and placed on the now-scaled board.
    if (playerToken) { // Only call if player token has been initialized
        movePlayerToken();
    }
    // console.log(`Resized to: ${newWidth}x${newHeight}`); // For debugging
}


// Event Listener for the Dice Button
rollDiceBtn.addEventListener('click', rollDice);

// Initial setup when the page loads
createBoard(); // Draw the board
initializePlayerToken(); // Place the player token at the start (logical 1)
resetQuizPool(); // Initialize the quiz question pool at the start of the game
displayMessage("Roll the dice to start!"); // Show initial message

// NEW: Add event listeners for resizing and call once on load
window.addEventListener('resize', resizeGame);
resizeGame(); // Initial call to set the correct size on load