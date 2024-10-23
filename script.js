const wordsApiUrl = 'https://random-word-api.herokuapp.com/word?number=1'; // Example API endpoint

let chosenWord, displayWord, wrongGuesses, guessedLetters;

const wordDisplay = document.getElementById('wordDisplay');
const lettersDiv = document.getElementById('letters');
const wrongGuessesSpan = document.getElementById('wrongGuesses');
const messageP = document.getElementById('message');
const restartButton = document.getElementById('restartButton');

async function fetchRandomWord() {
    try {
        const response = await fetch(wordsApiUrl);
        const data = await response.json();
        return data[0]; // Assuming the API returns an array of words
    } catch (error) {
        console.error('Error fetching word:', error);
        return 'error'; // Fallback word
    }
}

async function initializeGame() {
    chosenWord = await fetchRandomWord();
    if (chosenWord === 'error') {
        messageP.textContent = 'Failed to fetch a new word. Try again later!';
        return;
    }
    
    displayWord = Array(chosenWord.length).fill('_');
    wrongGuesses = 0;
    guessedLetters = [];

    updateDisplay();
    createLetterButtons();
    messageP.textContent = '';
    wrongGuessesSpan.textContent = '';
}

function updateDisplay() {
    wordDisplay.textContent = displayWord.join(' ');
    wrongGuessesSpan.textContent = wrongGuesses;
}

function createLetterButtons() {
    lettersDiv.innerHTML = '';
    for (let i = 97; i <= 122; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement('button');
        button.textContent = letter;
        button.addEventListener('click', () => guessLetter(letter));
        lettersDiv.appendChild(button);
    }
}

function guessLetter(letter) {
    if (guessedLetters.includes(letter)) return;

    guessedLetters.push(letter);
    const indices = [];

    for (let i = 0; i < chosenWord.length; i++) {
        if (chosenWord[i] === letter) indices.push(i);
    }

    if (indices.length > 0) {
        indices.forEach(index => displayWord[index] = letter);
        if (displayWord.join('') === chosenWord) {
            messageP.textContent = 'Congratulations! You guessed the word!';
            disableButtons();
            setTimeout(initializeGame, 2000); // Start a new game after 2 seconds
        }
    } else {
        wrongGuesses++;
        if (wrongGuesses >= 6) {
            messageP.textContent = `Game Over! The word was ${chosenWord}.`;
            disableButtons();
            setTimeout(initializeGame, 2000); // Start a new game after 2 seconds
        }
    }

    updateDisplay();
}

function disableButtons() {
    lettersDiv.querySelectorAll('button').forEach(button => button.disabled = true);
}

restartButton.addEventListener('click', initializeGame);

initializeGame();
