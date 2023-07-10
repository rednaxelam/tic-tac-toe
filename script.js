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

