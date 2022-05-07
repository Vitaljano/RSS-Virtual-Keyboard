import create from './utils/create';
import Key from './Key';
import language from './layouts/index';
import letterToUpperCase from './utils/helper';

export default class KeyBoard {
  constructor(rowsTemplate) {
    this.keys = null;
    this.keyBoard = null;
    this.rowsTemplate = rowsTemplate;
    this.output = null;
    this.fireKeyCodes = ['Backspace', 'Delete', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'CapsLock', 'Space'];
    this.changeableKeys = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Backquote', 'Minus', 'Equal', 'BracketLeft', 'BracketRight', 'Semicolon', 'Quote', 'Backslash', 'IntlBackslash', 'Comma', 'Period', 'Slash'];
    this.isCapsLock = false;
    this.altShift = false;
    this.isShiftPressed = false;
  }

  generateTextarea() {
    const textareaWrapper = create('div', '', 'textarea-wrapper');
    const textarea = create('textarea', '', 'textarea', ['placeholder', 'enter']);
    textareaWrapper.append(textarea);
    document.body.append(textareaWrapper);
    this.output = document.querySelector('.textarea');
  }

  generateKeyBoard() {
    this.keyBoard = create('div', '', 'frame');

    this.keyBoard.append(...this.rows);
    document.body.append(this.keyBoard);
  }

  generateKeys() {
    try {
      const rows = [];

      for (let i = 0; i < this.rowsTemplate.length; i += 1) {
        const row = create('div', '', 'row');

        for (let j = 0; j < this.rowsTemplate[i].length; j += 1) {
          const element = this.rowsTemplate[i][j];
          this.keyBase.forEach((el) => {
            if (el.code === element) {
              row.append(new Key(el).key);
            }
          });
        }
        rows.push(row);
      }
      this.rows = rows;
    } catch (e) {
      throw Error(e);
    }
  }

  init(lang) {
    this.keyBase = language[lang];
    this.generateTextarea();

    this.generateKeys();
    this.generateKeyBoard();
    this.generateEvents();

    this.letterKeys();
    this.output = document.querySelector('.textarea');
    this.frame = document.querySelector('.frame');
  }

  generateEvents() {
    document.onkeydown = this.handleOnKeyDown.bind(this);
    document.onkeyup = this.handleOnKeyUp.bind(this);
    document.onmousedown = this.handleOnMouseDown.bind(this);
    document.onmouseup = this.handleOnMouseUp.bind(this);
  }

  fireKeys(key) {
    const keyCode = key.dataset.code;
    let cursorPosition = this.output.selectionStart;
    const left = this.output.value.slice(0, cursorPosition);
    const right = this.output.value.slice(cursorPosition);

    if (keyCode === 'Tab') {
      this.output.value = `${left}\t${right}`;
    }

    if (keyCode === 'Backspace' && cursorPosition > 0) {
      this.output.value = `${left.slice(0, -1)}${right}`;
      cursorPosition -= 1;
    }

    if (keyCode === 'Delete') {
      this.output.value = `${left}${right.slice(1)}`;
    }
    // TODO: Implement arrow key
    if (keyCode === 'ArrowLeft') {
      cursorPosition = cursorPosition - 1 >= 0 ? cursorPosition - 1 : 0;
    }

    if (keyCode === 'ArrowRight') {
      cursorPosition += 1;
    }

    if (keyCode === 'ArrowUp') {
      const positionFromLeft = this.output.value.slice(0, cursorPosition).match(/(\n).*$(?!\1)/g) || [[1]];
      cursorPosition -= positionFromLeft[0].length;
    }
    if (keyCode === 'ArrowDown') {
      const positionFromLeft = this.output.value.slice(cursorPosition).match(/^.*(\n).*(?!\1)/) || [[1]];
      cursorPosition += positionFromLeft[0].length + 1;
    }
    if (keyCode === 'Space') {
      this.output.value = `${left} ${right}`;
      cursorPosition += 1;
    }
    if (keyCode === 'CapsLock') {
      this.isCapsLock = !this.isCapsLock;

      const capsLockBtn = document.querySelector('.capslock');
      if (this.isCapsLock) {
        capsLockBtn.classList.toggle('capslock-active');
      }

      letterToUpperCase(this.isCapsLock);
    }

    // this.output.focus();
  }

  handleOnKeyDown(e) {
    this.isCapsLock = e.getModifierState('CapsLock');
    const capsLockBtn = document.querySelector('.capslock');
    console.log(this.isCapsLock);

    if (this.isCapsLock) {
      capsLockBtn.classList.toggle('capslock-active');
    }

    if (this.isCapsLock) {
      letterToUpperCase(true);
    } else {
      letterToUpperCase(false);
    }

    if (e.code === 'AltLeft') {
      this.altShift = true;
      if (e.code === 'CtrlLeft' && this.altShift) {
        this.changeLanguage('ru');
      }
    }

    if (e.code === 'ShiftLeft') {
      this.isShiftPressed = true;
      this.shiftPress(true);
      // this.isShiftPressed = false;
    }
  }

  handleOnKeyUp(e) {
    if (e.code === 'ShiftLeft') {
      // this.isShiftPressed = ;
      this.shiftPress(false);
      this.isShiftPressed = false;
      // letterToUpperCase(false);
    }
  }

  handleOnMouseDown(e) {
    this.output.focus();

    if (this.fireKeyCodes.includes(e.target.dataset.code)) {
      this.fireKeys(e.target);
    }

    if (this.changeableKeys.includes(e.target.dataset.code)) {
      this.changeableKeyWrite(e.target);
    }

    if (e.target.dataset.code === 'ShiftLeft') {
      // this.isShiftPressed = true;
      this.shiftPress(true);
    }
  }

  handleOnMouseUp(e) {
    e.target.classList.remove('active');

    if (e.target.dataset.code === 'ShiftLeft') {
      // this.isShiftPressed = false;
      this.shiftPress(false);
    }

    this.output.focus();
  }

  letterKeys() {
    const letter = document.querySelectorAll('.letter');

    letter.forEach((el) => {
      el.addEventListener('mousedown', (e) => {
        this.output.value += e.target.textContent;
      });
    });
  }

  changeLanguage(lang) {
    this.keyBase = language[lang];
    const rows = document.querySelectorAll('.row');

    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i].querySelectorAll('.key');
      // eslint-disable-next-line no-restricted-syntax
      for (const item of row) {
        this.keyBase.map((el) => {
          if (el.code === item.dataset.code) {
            item.textContent = el.small;
          }
          return null;
        });
      }
    }
  }

  changeableKeyWrite(key) {
    const letter = key.querySelector('.main').textContent;
    this.output.value += letter;
  }

  // eslint-disable-next-line class-methods-use-this
  shiftPress(isShiftPressed) {
    this.changeableKeys.forEach((el) => {
      const key = document.querySelector(`*[data-code="${el}"]`);
      const main = key.querySelector('.main');
      const sub = key.querySelector('.sub');

      main.classList.toggle('main');
      main.classList.toggle('sub');
      sub.classList.toggle('main');
      sub.classList.toggle('sub');

      if (isShiftPressed) {
        letterToUpperCase(true);
      } else {
        letterToUpperCase(false);
      }
    });
  }
}
