"use strict";

const gameBoard = (() => {

  const board = [['', '', ''], ['', '', ''], ['', '', '']];

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
    return this;
  }
  
  function setCross(i, j) {
    validateIsPossibleMove(i, j);
    board[i][j] = 'x';
    return this;
  }

  function getValueAt(i, j) {
    validateIndices(i, j);
    return board[i][j];
  }

  function clearBoard() {
    for (let i = 0; i < board.length; i++) {
      for (let j =  0; j < board[i].length; j++) {
        board[i][j] = '';
      }
    }
    return this;
  }

  return {isEmpty, setNought, setCross, getValueAt, clearBoard};

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

    const choiceDiv = createChoiceDiv({'go back': displayStartFrame, 'play': dummyFunction});

    mainContainer.append(textBox, choiceDiv);
  }

  function displayDifficultySelectionFrame() {
    clearDisplay();
    const mainContainer = getMainContainer();
    const textBox = createTextBox([['h2', 'Select AI Difficulty']]);
    const choiceDiv = createChoiceDiv({'easy': dummyFunction, 'medium': dummyFunction, 'impossible': dummyFunction});
    const goBackDiv = createChoiceDiv({'go back': displayStartFrame});
    mainContainer.append(textBox, choiceDiv, goBackDiv);
  }

  function dummyFunction() {

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

  function displayGame(player1Name, player2Name) {
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
        gameBoardDOMContainer.append(gameBoardDOMElement);
      }
    }

    const choiceDiv = createChoiceDiv({'finish': displayResultsScreen, 'play again': dummyFunction});
    choiceDiv.setAttribute('style', 'visibility: hidden;');

    mainContainer.append(resultTotalsContainer, gameBoardDOMContainer, choiceDiv);

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
  }

  return {displayStartFrame, displayNameSelectionFrame, displayDifficultySelectionFrame, displayGame, displayResultsScreen};

})();