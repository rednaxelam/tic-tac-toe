"use strict";

const gameBoard = (() => {

  const board = [['', '', ''], ['', '', ''], ['', '', '']];
  let squaresOccupied = 0;

  function validateIndices(i, j) {
    if (!Number.isInteger(i) || !Number.isInteger(j)) throw new TypeError(`Arguments must be integers of type number`);
    else if (i < 0 || i > 2 || j < 0 || j > 2) throw new Error('Arguments must be between 0 and 2 inclusive');
  }

  function isEmpty(i, j) {
    validateIndices(i, j);
    return board[i][j] === '';
  }

  const validateIsPossibleMove = (i, j) => {
    validateIndices(i, j);
    if (!isEmpty(i, j)) throw new Error('Not possible to make this move - area is already occupied');
  }

  function setNought(i, j) {
    validateIsPossibleMove(i, j);
    board[i][j] = 'o';
    squaresOccupied++;
    return this;
  }
  
  function setCross(i, j) {
    validateIsPossibleMove(i, j);
    board[i][j] = 'x';
    squaresOccupied++;
    return this;
  }

  function setMarker(marker, i, j) {
    if (marker === 'x') setCross(i, j);
    else if (marker === 'o') setNought(i, j);
    else throw new Error(`invalid marker: ${marker}`);
    return this;
  }

  function getValueAt(i, j) {
    validateIndices(i, j);
    return board[i][j];
  }
  
  function getNumSquaresOccupied() {
    return squaresOccupied;
  }

  function clearBoard() {
    for (let i = 0; i < board.length; i++) {
      for (let j =  0; j < board[i].length; j++) {
        board[i][j] = '';
      }
    }
    squaresOccupied = 0;
    return this;
  }

  return {isEmpty, setNought, setCross, setMarker, getValueAt, getNumSquaresOccupied, clearBoard};

})();

const playerFactory = (name, marker, type) => {
  
  if (!((typeof name === 'string') && name.length > 0)) throw new Error('name must be a non-empty string');
  else if (!(marker === 'x' || marker === 'o')) throw new Error('Invalid marker (marker must be either x or o)');
  else if (!(type === 'human' || type === 'aiEasy' || type === 'aiMedium' || type === 'aiImpossible')) {
    throw new Error(`Invalid player type (player must be of type human, aiEasy, aiMedium, or aiImpossible)`);
  }

  function getName() {
    return name;
  }

  function getMarker() {
    return marker;
  }

  function getType() {
    return type;
  }

  return {getName, getMarker, getType};
  
}

const displayController = (() => {
  
  function createElement(type, attributes = {}) {
    const element = document.createElement(type);
    for (const key in attributes) {
      if (key === "class") {
          const classArray = attributes["class"];
          for (let i = 0; i < classArray.length; i++) {
            element.classList.add(classArray[i]);
          }
      } else {
        element.setAttribute(key, attributes[key]);
      }
    }
    return element;
  }
  
  function createChoiceDiv(contentFunctionPairs) {
    const choiceDiv = createElement('div', {'class': ['choices', 'box']});
    for (const key in contentFunctionPairs) {
      const button = createElement('button');
      button.textContent = key;
      button.addEventListener('click', contentFunctionPairs[key]);
      choiceDiv.appendChild(button);
    }
    return choiceDiv;
  }
  
  
  function createTextBox(typeTextPairs) {
    const textBox = createElement('div', {"class": ["text-box", "box"]});
    for (const pair of typeTextPairs) {
      const textElement = createElement(pair[0]);
      textElement.textContent = pair[1];
      textBox.appendChild(textElement);
    }
    return textBox;
  }

  function clearDisplay() {
    const mainContainer = getMainContainer();
    while (mainContainer.hasChildNodes()) {
      mainContainer.removeChild(mainContainer.firstChild);
    }
  }
  
  function getMainContainer() {
    const mainContainer = document.querySelector('#main-container');
    return mainContainer;
  }

  function displayStartFrame() {
    clearDisplay();
    const mainContainer = getMainContainer();
    const textBox = createTextBox([['h1', 'Tic Tac Toe']]);
    const choiceDiv = createChoiceDiv({'play vs ai': displayDifficultySelectionFrame, 'play vs a friend': displayNameSelectionFrame});
    mainContainer.append(textBox, choiceDiv);
  }

  function displayNameSelectionFrame() {
    clearDisplay();
    const mainContainer = getMainContainer();
    const textBox = createTextBox([['h2', 'Enter Names'], ['p', '(optional)']]);

    const nameInputContainer = createElement('div', {'id': 'name-input-container'});
    
    function createNameInputControl(markerImgSource) {
      const inputControlContainer = createElement('div', {'class': ['name-input']});
      const img = createElement('img', {'src': markerImgSource})
      const input = createElement('input', {'type': 'text'});
      inputControlContainer.append(img, input);
      return inputControlContainer;
    }

    const crossNameInput = createNameInputControl('./img/icons/cross.svg');
    const noughtNameInput = createNameInputControl('./img/icons/nought.svg');

    nameInputContainer.append(crossNameInput, noughtNameInput);
    textBox.append(nameInputContainer);

    const choiceDiv = createChoiceDiv(
    {
      'go back': displayStartFrame, 
      'play': game.startGame(playerFactory(crossNameInput.querySelector('input').value, 'x', 'human'), playerFactory(noughtNameInput.querySelector('input').value, 'o', 'human'))
    }
    );

    mainContainer.append(textBox, choiceDiv);
  }

  function displayDifficultySelectionFrame() {
    clearDisplay();
    const mainContainer = getMainContainer();
    const textBox = createTextBox([['h2', 'Select AI Difficulty']]);
    const choiceDiv = createChoiceDiv(
    {
      'easy': game.startGame(playerFactory('Human - You', 'x', 'human'), playerFactory('AI - Easy', 'o', 'aiEasy')), 
      'medium': game.startGame(playerFactory('Human - You', 'x', 'human'), playerFactory('AI - Medium', 'o', 'aiMedium')), 
      'impossible': game.startGame(playerFactory('Human - You', 'x', 'human'), playerFactory('AI - Impossible', 'o', 'aiImpossible'))
    }
    );
    const goBackDiv = createChoiceDiv({'go back': displayStartFrame});
    mainContainer.append(textBox, choiceDiv, goBackDiv);
  }

  function createTotalDiv(identifierName, identifierSymbolSource, totalValueNumber) {
    const totalDiv = createElement('div', {'class': ['total', `${identifierName}`]});

    const identifierDiv = createElement('div', {'class': ['total-identifier']});
    const img = undefined;
    if (identifierSymbolSource !== undefined) {
      img = createElement('img', {'src': identifierSymbolSource});
    }
    const name = createElement('p')
    name.textContent = identifierName;
    if (img !== undefined) identifierDiv.append(img, name);
    else identifierDiv.append(name);

    const totalValue = createElement('p', {'class': ['total-value']});
    if (totalValueNumber !== undefined) totalValue.textContent = `${totalValueNumber}`;
    else totalValue.textContent = '0';

    totalDiv.append(identifierDiv, totalValue);
    return totalDiv;
  }

  function displayGame(player1Name, player2Name, startingMarker) {
    clearDisplay();
    const mainContainer = getMainContainer();

    const resultTotalsContainer = createElement('div', {'id': 'result-totals-container'});
    const player1Total = createTotalDiv|(player1Name, './img/icons/cross.svg');
    const tieTotal = createTotalDiv|('Tie');
    const player2Total = createTotalDiv(player2Name, './img/icons/nought.svg');
    resultTotalsContainer.append(player1Total, tieTotal, player2Total);

    const gameBoardDOMContainer = createElement('div', {'id': 'game-board-container'});
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const gameBoardDOMElement = createElement('div', {'data-i': `${i}`, 'data-j': `${j}`, 'class': ['game-board-element']});
        
        if (startingMarker === "cross") gameBoardDOMElement.classList.add('display-cross-on-hover');
        else gameBoardDOMElement.classList.add('display-nought-on-hover');

        gameBoardDOMElement.classList.add('unsettled');
        
        // can call game.playRound()
        gameBoardDOMElement.addEventListener('click', game.playRound);

        gameBoardDOMContainer.append(gameBoardDOMElement);
      }
    }

    const choiceDiv = createChoiceDiv({'finish': displayResultsScreen, 'play again': game.startNextGame});
    choiceDiv.setAttribute('style', 'visibility: hidden;');

    mainContainer.append(resultTotalsContainer, gameBoardDOMContainer, choiceDiv);

  }

  function gameGetGameBoardElementByIndices(i, j) {
    const gameBoardDOMContainer = document.getElementById('game-board-container');
    const gameBoardDOMElement = gameBoardDOMContainer.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    return gameBoardDOMElement;
  }

  function gameStyleWinningLine(winningPairs) {
    for (pair of winningPairs) {
      const gameBoardDOMElement = gameGetGameBoardElementByIndices(pair[0], pair[1]);
      gameBoardDOMElement.classList.add("winning-line");
    }
  }

  function gameRemoveHoverBackgrounds() {
    const gameBoardDOMElements = document.querySelectorAll('.game-board-element');
    for (let i = 0; i < gameBoardDOMElements.length; i++) {
      const gameBoardDOMElement = gameBoardDOMElements.item(i);
      gameBoardDOMElement.classList.remove('display-cross-on-hover');
      gameBoardDOMElement.classList.remove('display-nought-on-hover');
    }
  }

  function gameAddNoughtHoverBackgrounds() {
    const gameBoardDOMElements = document.querySelectorAll('.game-board-element');
    for (let i = 0; i < gameBoardDOMElements.length; i++) {
      const gameBoardDOMElement = gameBoardDOMElements.item(i);
      if (gameBoardDOMElement.classList.contains('unsettled')) {
        gameBoardDOMElement.classList.remove('display-cross-on-hover');
        gameBoardDOMElement.classList.add('display-nought-on-hover');
      }
    }
  }

  function gameAddCrossHoverBackgrounds() {
    const gameBoardDOMElements = document.querySelectorAll('.game-board-element');
    for (let i = 0; i < gameBoardDOMElements.length; i++) {
      const gameBoardDOMElement = gameBoardDOMElements.item(i);
      if (gameBoardDOMElement.classList.contains('unsettled')) {
        gameBoardDOMElement.classList.remove('display-nought-on-hover');
        gameBoardDOMElement.classList.add('display-cross-on-hover');
      }
    }
  }

  // following to be called by game object after a valid move
  function gameSettleGameBoardElement(i, j, marker) {
    const gameBoardDOMElement = gameGetGameBoardElementByIndices(i, j);
    gameBoardDOMElement.classList.remove('unsettled');
    gameBoardDOMElement.classList.remove('display-cross-on-hover');
    gameBoardDOMElement.classList.remove('display-nought-on-hover');
    gameBoardDOMElement.classList.add('settled');
    //remove game.playRound() listener
    gameBoardDOMElement.removeEventListener('click', game.playRound);

    if (marker === 'x') gameBoardDOMElement.appendChild(createElement('img', {'src': './img/icons/cross.svg'}));
    else if (marker === 'o') gameBoardDOMElement.appendChild(createElement('img', {'src': './img/icons/nought.svg'}));
  }

  
  // following will be called if game ends due to someone winning. If there is a tie it won't be called
  function gameChangeToFinishedBoard() {
    gameRemoveHoverBackgrounds();
    const gameBoardDOMElements = document.querySelectorAll('.game-board-element');
    for (let i = 0; i < gameBoardDOMElements.length; i++) {
      const gameBoardDOMElement = gameBoardDOMElements.item(i);
      gameSettleGameBoardElement(gameBoardDOMElement.getAttribute('data-i'), gameBoardDOMElement.getAttribute('data-j'));
    }
  }

  function gameIncrementTotal(identifierName) {
    const total = document.querySelector(`.${identifierName} .total-value`);
    let newTotalValue = ++Number(total.textContent);
    total.textContent = newTotalValue;
  }

  function gameDisplayChoiceDiv() {
    document.querySelector('.choices').removeAttribute('style');
  }

  function gameHideChoiceDiv() {
    document.querySelector('.choices').setAttribute('style', 'visibility: hidden;');
  }

  function gameResetGameBoard(startingMarker) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const gameBoardDOMElement = gameGetGameBoardElementByIndices(i, j);
        while (gameBoardDOMElement.hasChildNodes()) {
          gameBoardDOMElement.removeChild(gameBoardDOMElement.firstChild);
        }
        gameBoardDOMElement.classList.remove('settled');
        gameBoardDOMElement.classList.add('unsettled');
        // add game.playRound listener 
        gameBoardDOMElement.addEventListener('click', game.playRound);
      }
    }
    if (startingMarker === 'x') gameAddCrossHoverBackgrounds();
    else gameAddNoughtHoverBackgrounds();
  }


  function displayResultsScreen(player1Name, player2Name, numPlayer1Wins, numTies, numPlayer2Wins) {
    clearDisplay();
    const mainContainer = getMainContainer();
    const textBox = createTextBox([['h2', 'Final Results:']]);

    const finalTotalsContainer = createElement('div', {'id': 'final-totals-container'});
    const player1Total = createTotalDiv|(player1Name, undefined, numPlayer1Wins);
    const tieTotal = createTotalDiv|('Tie', undefined, numTies);
    const player2Total = createTotalDiv(player2Name, undefined, numPlayer2Wins);
    finalTotalsContainer.append(player1Total, tieTotal, player2Total);

    textBox.append(finalTotalsContainer);

    const choiceDiv = createChoiceDiv({'go back to main menu': displayStartFrame});

    mainContainer.append(textBox, choiceDiv);
  }

  return {displayStartFrame, 
    displayNameSelectionFrame, 
    displayDifficultySelectionFrame, 
    displayGame,
    gameSettleGameBoardElement,
    gameChangeToFinishedBoard,
    gameStyleWinningLine,
    gameIncrementTotal,
    gameDisplayChoiceDiv,
    gameHideChoiceDiv,
    gameResetGameBoard,
    displayResultsScreen};

})();

const game = (() => {

  let numPlayerXWins = 0;
  let numTies = 0;
  let numPlayerOWins = 0;
  let playerX = undefined;
  let playerO = undefined;
  let playingFirst = undefined;
  let activePlayer = undefined;

  function resetAll() {
    numPlayerXWins = 0;
    numTies = 0;
    numPlayerOWins = 0;
    playerX = undefined;
    playerO = undefined;
    playingFirst = undefined;
    activePlayer = undefined;
  }

  function validateMarker(marker) {
    if (marker !== 'x' && marker !== 'o') throw new Error(`Illegal marker: ${marker}`);
  }

  function validateIndex(x) {
    if (!Number.isInteger(x)) throw new TypeError(`Argument must be an integer of type number`);
    else if (x < 0 || x > 2) throw new Error('Argument must be between 0 and 2 inclusive');
  }

  function validateIndices(i, j) {
    if (!Number.isInteger(i) || !Number.isInteger(j)) throw new TypeError(`Arguments must be integers of type number`);
    else if (i < 0 || i > 2 || j < 0 || j > 2) throw new Error('Arguments must be between 0 and 2 inclusive');
  }

  function isWinningRow(marker, i) {
    validateMarker(marker);
    validateIndex(i);
    for (let j = 0; j < 3; j++) {
      if (gameBoard.getValueAt(i, j) !== marker) {
        return false;
      }
    }
    return [[i, 0], [i, 1], [i, 2]];
  }

  function isWinningColumn(marker, j) {
    validateMarker(marker);
    validateIndex(j);
    for (let i = 0; i < 3; i++) {
      if (gameBoard.getValueAt(i, j) !== marker) {
        return false;
      }
    }
    return [[0, j], [1, j], [2, j]];
  }

  function isWinningDiagonal(marker, i, j) {
    validateMarker(marker);
    validateIndices(i, j);
    if (i === 1 && j === 1) {

      if (gameBoard.getValueAt(0, 0) === marker && gameBoard.getValueAt(2, 2) === marker) {
        return [[0, 0], [1, 1], [2, 2]];
      } else if (gameBoard.getValueAt(0, 2) === marker && gameBoard.getValueAt(2, 0) === marker) {
        return [[0, 2], [1, 1], [2, 0]];
      }
      else return false;

    } else if (i === j) {
      for (let x = 0; x < 3; x++) {
        if (gameBoard.getValueAt(x, x) !== marker) {
          return false;
        }
      }
      return [[0, 0], [1, 1], [2, 2]];

    } else if ((i === 0 && j === 2) || (i === 2 && j === 0)) {
      for (let x = 0; x < 3; x++) {
        if (gameBoard.getValueAt(x, 2-x) !== marker) {
          return false;
        }
      }
      return [[0, 2], [1, 1], [2, 0]];
    } 
    
    return false;
  }

  function isWinningMove(marker, i, j) {
    return !!isWinningRow(marker, i, j) || !!isWinningColumn(marker, i, j) || !!isWinningDiagonal(marker, i, j);
  }

  function returnWinningLine(marker, i, j) {
    if (isWinningRow(marker, i, j)) return isWinningRow(marker, i, j);
    else if (isWinningColumn(marker, i, j)) return isWinningColumn(marker, i, j);
    else if (isWinningDiagonal(marker, i, j)) return isWinningDiagonal(marker, i, j);
    else throw new Error('Not possible to return winning line if there are no winning lines');
  }

  function incrementResultTotal(winningPlayer = null) {
    if (winningPlayer === playerX) numPlayerXWins++;
    else if (winningPlayer === playerO) numPlayerOWins++;
    else if (winningPlayer === null) numTies++;
    else throw new Error(`invalid argument: ${winningPlayer}`);
  }

  function returnNonActivePlayer() {
    if (activePlayer === playerX) return playerO;
    else return playerX;
  }

  function returnPlayingSecondPlayer() {
    if (playingFirst === playerX) return playerO;
    else return playerX;
  }

  // this function should only be called on empty squares
  function playRound() {
    const i = this.getAttribute('data-i');
    const j = this.getAttribute('data-j');
    if (!gameBoard.isEmpty(i, j)) throw new Error("playRound can't be called on occupied square");
    const activeMarker = activePlayer.getMarker();
    gameBoard.setMarker(activeMarker, i, j);
    if (isWinningMove(activeMarker, i, j)) {
      displayController.gameChangeToFinishedBoard();
      displayController.gameStyleWinningLine(returnWinningLine(activeMarker, i, j));
      incrementResultTotal(activePlayer);
      displayController.gameIncrementTotal(activePlayer.getName());
      displayController.gameDisplayChoiceDiv();
    } else {
      displayController.gameSettleGameBoardElement(i, j, activeMarker);
      if (gameBoard.getNumSquaresOccupied() !== 9) {
        activePlayer = returnNonActivePlayer();
      } else {
        incrementResultTotal();
        displayController.gameIncrementTotal('Tie');
        displayController.gameDisplayChoiceDiv();
      }
    }
  }

  function startGame(playerXArg, playerOArg) {
    playerX = playerXArg;
    playerO = playerOArg;
    playingFirst = playerX;
    activePlayer = playerX;
    displayController.displayGame(playerX.getName(). playerO.getName(), playerX.getMarker());
  }

  function startNextGame() {
    displayController.gameResetGameBoard(playingFirst.getMarker());
    gameBoard.clearBoard();
    playingFirst = returnPlayingSecondPlayer();
    activePlayer = playingFirst;
    displayController.gameHideChoiceDiv();
  }

  function exitGame() {
    displayController.displayResultsScreen(playerX.getName(), playerO.getName(), numPlayerXWins, numTies, numPlayerOWins);
    resetAll();
  }

  return {playRound, startGame, startNextGame, exitGame};

})();

