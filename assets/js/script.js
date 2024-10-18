let startButton = document.querySelector(".start-button");
let resetButton = document.querySelector(".reset-button");
let wordBlanks = document.querySelector(".word-blanks");
let winCount = document.querySelector(".win");
let lossCount = document.querySelector(".lose");
let timeLeft = document.querySelector(".timer-count");
let words = ["surf", "hike", "adventure", "journey", "trek", "motorcycle", "explore", "lost", "expedition"];
let currentWordIndex = 0;
let wins = 0;
let losses = 0;
let gameOn = false;
let timer = 0;
let isWinner = false;

// Calls the init function to render the wins and loss count and retrieve the current word when the page loads
init();

// Renders the stored wins & losses and retrieves the index of the word that the user will guess
function init()
{
  renderWins();
  renderLosses();
  getWordIndex();
}

// Event listener that will start the game when the start button is clicked
startButton.addEventListener("click", function(event) {
  event.preventDefault();
  startButton.disabled = true;
  resetButton.disabled = true;

  // Renders the blanks based on the length of the current word
  renderBlanks(currentWordIndex);

  // Waits 1.5 seconds to call countdown so the render blanks animation is completed
  setTimeout(() => {
    // Starts the countdown and allows the user to start guessing letters
    countdown();
  }, 1500);
})

// Initiates an animation that wishes the user luck and renders blank spaces based on the length of the current word
function renderBlanks(currentWordIndex) {
  let index = 0;
  let luckFill = ["goo_ l_ck", "good l_ck", "good luck"];
  
  // Every time the function is called one of the blanks in "good luck" is filled then blank spaces for the current word are rendered
  let timeInterval = setInterval(function() {
    if (index < 3)
    {
      wordBlanks.textContent = luckFill[index];
      index++;
    }

    else
    {
      clearInterval(timeInterval);
      let blanks = "";
      for(let i = 0; i < words[currentWordIndex].length; i++)
      {
        blanks = blanks + "-";
      }
      wordBlanks.textContent = blanks;
    }
  }, 500);
}

// Starts the countdown and determines if the user won or lost
function countdown() {
  gameOn = true;
  timer = 10;
  timeLeft.textContent = timer;

  let timeInterval = setInterval(function() {
    timer--;
    timeLeft.textContent = timer;

    if(timer >= 0 && isWinner)
    {
      clearInterval(timeInterval);
      winLose();
    }
      
    if(timer === 0 && !isWinner)
    {
      clearInterval(timeInterval);
      winLose();
    }
  }, 1000);
  
}

// Renders win or loss message and count, isWinner and gameOn variable, increments the current word index, and turns the start and reset buttons back on
function winLose()
{
  if(isWinner)
  {
    isWinner = false;
    wordBlanks.textContent = "YOU WIN!!!";
    wins++;
    setWin();
  }

  else
  {
    wordBlanks.textContent = "YOU LOSE!!!";
    losses++;
    setLoss();
  }

  gameOn = false;
  currentWordIndex++;
  setWordIndex();
  startButton.disabled = false;
  resetButton.disabled = false;
}

// Updates the stored wins value and renders the win count
function setWin()
{
  localStorage.setItem("wins", wins);
  winCount.textContent = wins;
}

// Updates the stored loss value and renders the loss count
function setLoss()
{
  localStorage.setItem("losses", losses);
  lossCount.textContent = losses;
}

// Updates the stored index value for the word that will be guessed when the start button is clicked
function setWordIndex()
{
  // Will move the index to 0 when the end of the array is reached
  if(currentWordIndex > words.length - 1)
  {
    currentWordIndex = 0;
  }
  localStorage.setItem("index", currentWordIndex);
}

// Sets the currentWordIndex variable to the storedIndex amount or 0 if the storedIndex is null
function getWordIndex()
{
  let storedIndex = localStorage.getItem("index");
  if(storedIndex === null)
  {
    currentWordIndex = 0;
  }

  else
  {
    currentWordIndex = storedIndex;
  }
}

// Renders the win count to the screen
function renderWins()
{
  let storedWins = localStorage.getItem("wins");
  if (storedWins === null)
  {
    wins = 0;
  }

  else{
    wins = storedWins;
  }

  winCount.textContent = wins;
}

// Renders the loss count to the screen
function renderLosses()
{
  let storedLosses = localStorage.getItem("losses");
  if (storedLosses === null)
  {
    losses = 0;
  }

  else{
    losses = storedLosses;
  }

  lossCount.textContent = losses;
}

// Resets the wins, losses, and word index to 0 and updates the respective stored amounts
resetButton.addEventListener("click", function() {
  wins = 0;
  losses = 0;
  currentWordIndex = 0;
  setWin();
  setLoss();
  setWordIndex();
})

// Listens for keystrokes when the game is being played and determines if the user correctly guessed the word
document.addEventListener("keydown", function(event) {
  let currentWord = words[currentWordIndex];
  let wordArray = Array.from(currentWord);
  let blanksArray = Array.from(wordBlanks.textContent);
  let currentKey = event.key.toLowerCase();

  if(gameOn === true) 
  {
    for(let i = 0; i < wordArray.length; i++) 
    {
      if(currentKey === wordArray[i])
        {
          blanksArray[i] = currentKey;
        }
    }
    
    let wordGuess = blanksArray.join("");
    wordBlanks.textContent = wordGuess;

    if(wordGuess === currentWord)
    {
      isWinner = true; 
    }
  }
})