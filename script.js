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

// Game state variables
const boardSize = 100; // Total number of squares on the board
let playerPosition = 1; // Player starts at logical square 1

// Quiz Timer Variables
const quizTimeLimit = 15; // Time limit for each quiz in seconds
let currentQuizTimer;     // Stores the current remaining time
let quizInterval;         // Stores the setInterval ID to clear the timer later

// NEW: Global variable for available quiz questions
let availableQuizQuestions = [];

// NEW: Sound Objects
const diceRollSound = new Audio('sounds/diceroll.wav');
const snakeHissSound = new Audio('sounds/snakehiss.mp3');
const correctSound = new Audio('sounds/correct.wav');
const incorrectSound = new Audio('sounds/incorrect.mp3');
const winSound = new Audio('sounds/win.mp3');
const loseSound = new Audio('sounds/lose.mp3'); // For time's up or unexpected game over
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
// Format: {head_square_number: tail_square_number}
const snakes = {
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    98: 78,
    // Snakes from your image examples (using arbitrary tails for now, adjust as needed)
    3: 1, // Example: Snake at 3 goes to 1
    6: 2, // Example: Snake at 6 goes to 2
    8: 4, // Example: Snake at 8 goes to 4
    11: 7, // Example: Snake at 11 goes to 7
    14: 9, // Example: Snake at 14 goes to 9
    31: 22, // Example: Snake at 31 goes to 22
    37: 28, // Example: Snake at 37 goes to 28
    39: 29, // Example: Snake at 39 goes to 29
    45: 32, // Example: Snake at 45 goes to 32
    52: 43, // Example: Snake at 52 goes to 43
    54: 44, // Example: Snake at 54 goes to 44
    71: 58, // Example: Snake at 71 goes to 58
    77: 66, // Example: Snake at 77 goes to 66
    85: 72  // Example: Snake at 85 goes to 72
};


// Quiz data (your custom questions)
const quizData = [
    {
        "question": "Which of the following is considered one of the 'Big Four' venomous snakes in India?",
        "options": ["Rat Snake", "Common Krait", "Green Vine Snake", "Indian Rock Python"],
        "answer": "Common Krait"
    },
    {
        "question": "What is the primary type of venom produced by the Common Krait?",
        "options": ["Hemotoxic", "Cytotoxic", "Neurotoxic", "Myotoxic"],
        "answer": "Neurotoxic"
    },
    {
        "question": "Which snake is famous for its 'spectacle' marking on the hood?",
        "options": ["Russell's Viper", "Saw-scaled Viper", "Indian Cobra", "King Cobra"],
        "answer": "Indian Cobra"
    },
    {
        "question": "Where would you most likely find a King Cobra in India?",
        "options": ["Thar Desert", "Himalayan Foothills", "Coastal Saline Marshes", "Urban Residential Areas"],
        "answer": "Himalayan Foothills"
    },
    {
        "question": "Which of these Indian snakes is known for its aggressive defensive display, including coiling and hissing loudly?",
        "options": ["Indian Python", "Common Sand Boa", "Russell's Viper", "Trinket Snake"],
        "answer": "Russell's Viper"
    },
    {
        "question": "What is the main diet of the King Cobra?",
        "options": ["Rodents", "Birds", "Other Snakes", "Frogs"],
        "answer": "Other Snakes"
    },
    {
        "question": "Which Indian state has a high diversity of snake species due to its varied ecosystems?",
        "options": ["Rajasthan", "Punjab", "Kerala", "Haryana"],
        "answer": "Kerala"
    },
    {
        "question": "What is the primary characteristic that distinguishes a venomous snake from a non-venomous one (though not always reliable)?",
        "options": ["Head Shape", "Pupil Shape", "Presence of Fangs", "Size and Length"],
        "answer": "Presence of Fangs"
    },
    {
        "question": "Which of the following non-venomous snakes is often confused with venomous ones due to its markings or behavior?",
        "options": ["Rat Snake", "Common Wolf Snake", "Indian Python", "Trinket Snake"],
        "answer": "Rat Snake"
    },
    {
        "question": "What is the purpose of snake venom?",
        "options": ["Self-defense only", "Digestion only", "Immobilizing prey and defense", "Attracting mates"],
        "answer": "Immobilizing prey and defense"
    },
    {
        "question": "Which Indian snake is viviparous, meaning it gives birth to live young?",
        "options": ["Indian Cobra", "Common Krait", "Russell's Viper", "Rat Snake"],
        "answer": "Russell's Viper"
    },
    {
        "question": "What is the conservation status of the Indian Rock Python?",
        "options": ["Least Concern", "Critically Endangered", "Vulnerable", "Extinct in the Wild"],
        "answer": "Vulnerable"
    },
    {
        "question": "Which type of snakebite typically causes localized pain, swelling, and tissue necrosis?",
        "options": ["Neurotoxic", "Hemotoxic/Cytotoxic", "Myotoxic", "Cardiotoxic"],
        "answer": "Hemotoxic/Cytotoxic"
    },
    {
        "question": "What is the common name for the snake species 'Echis carinatus'?",
        "options": ["Indian Cobra", "Common Krait", "Russell's Viper", "Saw-scaled Viper"],
        "answer": "Saw-scaled Viper"
    },
    {
        "question": "Which of these practices is NOT recommended if you encounter a snake?",
        "options": ["Maintain a safe distance", "Try to catch or kill it", "Walk away slowly", "Alert professionals if it's in a residential area"],
        "answer": "Try to catch or kill it"
    },
    {
        "question": "What is the primary habitat of the Common Krait in India?",
        "options": ["Deep Forests", "Arid Deserts", "Agricultural fields and human settlements", "High Altitude Mountains"],
        "answer": "Agricultural fields and human settlements"
    },
    {
        "question": "Which of the 'Big Four' is responsible for the highest number of snakebite fatalities in India?",
        "options": ["Indian Cobra", "Common Krait", "Russell's Viper", "Saw-scaled Viper"],
        "answer": "Russell's Viper"
    },
    {
        "question": "What is the scientific term for shedding of skin by snakes?",
        "options": ["Hibernation", "Estivation", "Ecdysis", "Metamorphosis"],
        "answer": "Ecdysis"
    },
    {
        "question": "Which snake species in India is known to be arboreal (tree-dwelling) and has a distinct green coloration?",
        "options": ["Indian Rat Snake", "Green Pit Viper", "Common Krait", "Banded Racer"],
        "answer": "Green Pit Viper"
    },
    {
        "question": "What is the main reason for the decline in snake populations in India?",
        "options": ["Over-hunting by predators", "Climate change causing colder winters", "Habitat loss and human-wildlife conflict", "Increased awareness leading to more snake rescues"],
        "answer": "Habitat loss and human-wildlife conflict"
    }
];

/**
 * Helper function to map a logical square number (1-100) to its DOM element index (0-99).
 * This is crucial for correctly positioning the player token on the zig-zag board,
 * as the HTML `gameBoard.children` order does not directly match the logical 1-100 sequence.
 * @param {number} logicalPos The logical square number (1 to 100).
 * @returns {number} The 0-indexed position in the gameBoard.children HTMLCollection.
 */
function logicalToDomIndex(logicalPos) {
    // Determine the 0-indexed row from the bottom of the board (0 for 1-10, 9 for 91-100)
    const rowFromBottom = Math.floor((logicalPos - 1) / 10);

    // Determine the 0-indexed column within its logical row (0 for 1, 9 for 10)
    const colInLogicalRow = (logicalPos - 1) % 10;

    let domColIndex;
    // For rows that go Left-to-Right (1-10, 21-30, etc. - even `rowFromBottom` indices)
    if (rowFromBottom % 2 === 0) {
        domColIndex = colInLogicalRow;
    }
    // For rows that go Right-to-Left (11-20, 31-40, etc. - odd `rowFromBottom` indices)
    else {
        domColIndex = 9 - colInLogicalRow; // Reverse column order for these rows
    }

    // Calculate the 0-indexed DOM row from the top (0 for row 91-100, 9 for row 1-10)
    // This is because elements are appended from top-left to bottom-right in the HTML grid.
    const domRowIndex = 9 - rowFromBottom;

    // The final DOM index is (DOM row index * number of columns) + DOM column index
    const domIndex = domRowIndex * 10 + domColIndex;
    return domIndex;
}


// Function to create the game board squares
function createBoard() {
    gameBoard.innerHTML = ''; // Clear any existing squares
    const squaresInLogicalOrder = []; // Temporary array to hold square elements 1 through 100 in logical order

    // 1. Create all 100 square elements, assigning their logical number as text
    for (let i = 1; i <= boardSize; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.dataset.number = i; // Store logical number (1 to 100)
        square.innerHTML = i; // Display the logical number directly on the square

        // Add CSS classes for checkerboard pattern - assuming your CSS handles .lighter-square and .darker-square
        // This logic calculates the visual position for checkerboarding
        const rowFromBottom = Math.floor((i - 1) / 10);
        const colInLogicalRow = (i - 1) % 10;

        let visualColIndex; // This determines the column for checkerboard pattern
        if (rowFromBottom % 2 === 0) { // L-R rows (1-10, 21-30 etc.)
            visualColIndex = colInLogicalRow;
        } else { // R-L rows (11-20, 31-40 etc.)
            visualColIndex = 9 - colInLogicalRow;
        }

        // Apply checkerboard pattern based on the sum of rowFromBottom and visualColIndex
        if ((rowFromBottom + visualColIndex) % 2 === 0) {
            square.classList.add('lighter-square'); // Assumes your CSS defines these classes
        } else {
            square.classList.add('darker-square');  // Assumes your CSS defines these classes
        }

        // Add snake emoji and styling class if it's a snake head
        if (snakes[i]) {
            square.classList.add('snake-head'); // Assumes your CSS defines this class
            square.innerHTML += ' 🐍'; // Append the snake emoji
        }

        // Add trophy emoji for the winning position (100)
        if (i === boardSize) {
            square.innerHTML += ' 🏆'; // Append a trophy for win
            square.classList.add('win-square'); // Assumes your CSS defines this class
        }

        squaresInLogicalOrder.push(square);
    }

    // 2. Append squares to the gameBoard in the correct visual order (top-left to bottom-right)
    // This uses the `logicalToDomIndex` to place each logical square into its corresponding DOM slot.
    const finalDomOrder = new Array(boardSize);
    for (let logicalNum = 1; logicalNum <= boardSize; logicalNum++) {
        const domIdx = logicalToDomIndex(logicalNum);
        finalDomOrder[domIdx] = squaresInLogicalOrder[logicalNum - 1]; // `squaresInLogicalOrder` is 0-indexed
    }
    // Now, append all squares to the game board in this calculated DOM order
    finalDomOrder.forEach(square => gameBoard.appendChild(square));
}


// Player Token Initialization and Movement
let playerToken; // Declare playerToken globally

function initializePlayerToken() {
    if (!playerToken) { // Create token only if it doesn't exist
        playerToken = document.createElement('div');
        playerToken.classList.add('player'); // Assumes your CSS defines this class (e.g., for red circle)
        gameBoard.appendChild(playerToken); // Add token to the game board
    }
    updatePlayerPositionDisplay(); // Update the displayed player position number
    movePlayerToken(); // Move the token to the initial square (logical 1)
}


// Function to display messages to the user
function displayMessage(msg) {
    messageArea.textContent = msg;
}

// Function to update the player's position text display
function updatePlayerPositionDisplay() {
    playerPositionSpan.textContent = playerPosition; // Directly display playerPosition (1-100)
}

// Function to visually move the player token on the board
function movePlayerToken() {
    // Use the helper function to get the correct DOM element index for the current playerPosition
    const targetDomIndex = logicalToDomIndex(playerPosition);
    const targetSquare = gameBoard.children[targetDomIndex];

    if (targetSquare) {
        // Calculate positions relative to the game board
        const boardRect = gameBoard.getBoundingClientRect();
        const squareRect = targetSquare.getBoundingClientRect();

        // Position the token in the center of the target square
        playerToken.style.left = (squareRect.left - boardRect.left + (squareRect.width / 2) - (playerToken.offsetWidth / 2)) + 'px';
        playerToken.style.top = (squareRect.top - boardRect.top + (squareRect.height / 2) - (playerToken.offsetHeight / 2)) + 'px';
    }
}


// Function to roll the dice and move the player
function rollDice() {
    // NEW: Play background music on first interaction
    if (!isMusicPlaying) {
        backgroundMusic.play().catch(e => console.log("Background music autoplay blocked:", e));
        isMusicPlaying = true;
    }

    rollDiceBtn.disabled = true; // Disable button during roll/move
    displayMessage("Rolling dice...");
    diceRollSound.play(); // Play dice roll sound

    const roll = Math.floor(Math.random() * 6) + 1; // Get random number from 1 to 6
    currentRollSpan.textContent = roll; // Display the rolled number

    let newPosition = playerPosition + roll;

    // Check if player goes beyond boardSize (100)
    if (newPosition > boardSize) {
        displayMessage(`You rolled a ${roll}! You need exactly ${boardSize - playerPosition} to win. Stay put.`);
        rollDiceBtn.disabled = false; // Re-enable button
        return;
    }

    displayMessage(`You rolled a ${roll}! Moving from ${playerPosition} to ${newPosition}.`);

    // Animate movement square by square
    let animationPosition = playerPosition;
    const interval = setInterval(() => {
        animationPosition++;
        if (animationPosition <= newPosition) {
            playerPosition = animationPosition;
            updatePlayerPositionDisplay();
            movePlayerToken();
        } else {
            clearInterval(interval); // Stop animation
            checkLanding(newPosition); // Check for snakes or win after animation
        }
    }, 200); // Adjust animation speed here (milliseconds per square)
}

// Function to check if player landed on a special square or won
function checkLanding(finalPosition) {
    playerPosition = finalPosition; // Update player's final position to the final landing spot

    if (playerPosition === boardSize) {
        displayMessage("Congratulations! You've reached square 100 and won!");
        winSound.play(); // Play win sound
        rollDiceBtn.disabled = true; // Disable button after winning
        backgroundMusic.pause(); // Stop background music
    } else if (snakes[playerPosition]) { // Check if current position is a snake head
        displayMessage(`Oh no! You landed on a snake at ${playerPosition}! Answer a question to save yourself!`);
        showQuiz(); // Show the quiz modal
    } else {
        // If not a snake and not the win square, re-enable the dice button
        rollDiceBtn.disabled = false;
    }
}

// Quiz Functions
let currentQuizQuestion = {}; // Store the current question and answer

// NEW: Function to reset the pool of available questions
function resetQuizPool() {
    // Create a shallow copy of quizData to avoid modifying the original array
    availableQuizQuestions = [...quizData];
    // Optional: Shuffle the questions when resetting the pool for better randomness
    for (let i = availableQuizQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableQuizQuestions[i], availableQuizQuestions[j]] = [availableQuizQuestions[j], availableQuizQuestions[i]];
    }
}


function showQuiz() {
    quizModal.classList.remove('hidden'); // Show the modal (remove the 'hidden' class)
    rollDiceBtn.disabled = true; // Keep dice button disabled during quiz

    // NEW: Ensure there are questions available in the pool
    if (availableQuizQuestions.length === 0) {
        resetQuizPool(); // Reset the pool if all questions have been asked
        displayMessage("All unique questions asked! Resetting quiz pool."); // Inform the player
    }

    // MODIFIED: Pick a random question from the available pool
    const randomIndex = Math.floor(Math.random() * availableQuizQuestions.length);
    currentQuizQuestion = availableQuizQuestions[randomIndex];

    // NEW: Remove the asked question from the available pool
    availableQuizQuestions.splice(randomIndex, 1);


    // NEW: Initialize and display timer
    quizTimerDisplay.style.display = 'block'; // Make timer visible
    currentQuizTimer = quizTimeLimit;
    quizTimerDisplay.textContent = `Time: ${currentQuizTimer}s`;
    quizTimerDisplay.style.color = ''; // Reset color in case it was red from previous quiz

    // Clear any existing interval to prevent multiple timers running
    if (quizInterval) {
        clearInterval(quizInterval);
    }

    quizInterval = setInterval(() => {
        currentQuizTimer--;
        quizTimerDisplay.textContent = `Time: ${currentQuizTimer}s`;

        // Optional: Change timer color when low
        if (currentQuizTimer <= 5) {
            quizTimerDisplay.style.color = 'red';
        }

        if (currentQuizTimer <= 0) {
            clearInterval(quizInterval); // Stop the timer
            handleTimeUp(); // Call function for time's up
        }
    }, 1000); // Update every second

    quizQuestion.textContent = currentQuizQuestion.question; // Display the question

    quizOptions.innerHTML = ''; // Clear previous options

    // Create buttons for each option
    currentQuizQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option)); // Add click listener
        quizOptions.appendChild(button);
    });
}

function checkAnswer(selectedOption) {
    clearInterval(quizInterval); // Stop the timer immediately when an answer is selected
    quizTimerDisplay.style.display = 'none'; // Hide timer display
    quizTimerDisplay.style.color = ''; // Reset timer color

    if (selectedOption === currentQuizQuestion.answer) {
        correctSound.play(); // Play correct sound
        // Bonus for correct answer within time limit
        let bonusMessage = "Correct! You avoided the snake!";
        if (currentQuizTimer > 0) { // Check if time was still remaining
            playerPosition += 1; // Move forward 1 square bonus
            bonusMessage = `Correct! You avoided the snake and moved forward 1 square to ${playerPosition}!`;
        }
        displayMessage(bonusMessage);
        updatePlayerPositionDisplay();
        movePlayerToken(); // Animate the bonus move
        hideQuiz();
        rollDiceBtn.disabled = false; // Re-enable dice button
    } else {
        incorrectSound.play(); // Play incorrect answer sound
        snakeHissSound.play(); // Play snake hiss/bite sound
        // Existing wrong answer logic
        displayMessage(`Incorrect! The answer was "${currentQuizQuestion.answer}". You slide back to ${snakes[playerPosition]}!`);
        playerPosition = snakes[playerPosition];
        updatePlayerPositionDisplay();
        movePlayerToken();
        hideQuiz();
        rollDiceBtn.disabled = false;
    }
}

// Function to handle when the quiz timer runs out
function handleTimeUp() {
    quizTimerDisplay.style.display = 'none'; // Hide timer display
    quizTimerDisplay.style.color = ''; // Reset timer color
    incorrectSound.play(); // Play incorrect answer sound
    snakeHissSound.play(); // Play snake hiss/bite sound

    // Treat as a wrong answer and slide player back
    displayMessage(`Time's up! The answer was "${currentQuizQuestion.answer}". You slide back to ${snakes[playerPosition]}!`);
    playerPosition = snakes[playerPosition]; // Move player back to snake tail
    updatePlayerPositionDisplay();
    movePlayerToken(); // Visually move token to new position
    hideQuiz(); // Hide the quiz modal
    rollDiceBtn.disabled = false; // Re-enable dice button
}

function hideQuiz() {
    quizModal.classList.add('hidden'); // Hide the modal (add the 'hidden' class back)
    // Ensure timer is stopped and hidden if quiz is closed prematurely (e.g., for debugging)
    if (quizInterval) {
        clearInterval(quizInterval);
    }
    quizTimerDisplay.style.display = 'none';
    quizTimerDisplay.style.color = '';
}


// Event Listener for the Dice Button
rollDiceBtn.addEventListener('click', rollDice);

// Initial setup when the page loads
createBoard(); // Draw the board
initializePlayerToken(); // Place the player token at the start (logical 1)
resetQuizPool(); // NEW: Initialize the quiz question pool at the start of the game
displayMessage("Roll the dice to start!"); // Show initial message