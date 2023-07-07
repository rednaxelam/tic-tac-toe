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