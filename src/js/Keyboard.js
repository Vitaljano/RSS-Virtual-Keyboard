import create from './utils/create';
import Key from './Key';
import language from './layouts/index';
import letterToUpperCase from './utils/helper';

export default class KeyBoard {
  constructor(rowsTemplate) {
    this.keys = null;
    this.keyBoard = null;
    this.keyLang = 'en';
    this.rowsTemplate = rowsTemplate;
    this.output = null;
    this.fireKeyCodes = ['Backspace', 'Delete', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'CapsLock', 'Space', 'Enter'];
    this.changeableKeys = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Backquote', 'Minus', 'Equal', 'BracketLeft', 'BracketRight', 'Semicolon', 'Quote', 'Backslash', 'IntlBackslash', 'Comma', 'Period', 'Slash'];
    this.isCapsLock = false;
    this.altCtrl = false;
    this.isShiftPressed = false;
  }

  generateTextarea() {
    const textareaWrapper = create('div', '', 'textarea-wrapper');
    const monitorBtn = create('div', '', 'monitor-btn');
    const textarea = create('textarea', '', 'textarea', ['placeholder', 'enter']);
    textareaWrapper.append(textarea);
    textareaWrapper.append(monitorBtn);
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
              row.append(new Key(el, this.handlers).key);
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
    this.generateEvents();

    this.generateKeys();
    this.generateKeyBoard();

    this.letterKeys();
    this.output = document.querySelector('.textarea');
    this.frame = document.querySelector('.frame');
  }

  generateEvents() {
    this.handlers = {
      handleOnMouseDown: this.handleOnMouseDown.bind(this),
      handleOnMouseUp: this.handleOnMouseUp.bind(this),
    };
    document.onkeydown = this.handleOnKeyDown.bind(this);
    document.onkeyup = this.handleOnKeyUp.bind(this);
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

    if (keyCode === 'Enter') {
      this.output.value = `${left}\n${right}`;
      cursorPosition += 1;
    }

    this.output.setSelectionRange(cursorPosition, cursorPosition);

    // this.output.focus();
  }

  handleOnKeyDown(e) {
    const activeKey = document.querySelector(`*[data-code=${e.code}]`);
    activeKey.classList.add('active');

    if (e.code === 'CapsLock') {
      const capsLockBtn = document.querySelector('.capslock');
      this.isCapsLock = e.getModifierState('CapsLock');

      if (this.isCapsLock) {
        letterToUpperCase(true);
        capsLockBtn.classList.toggle('capslock-active');
      } else {
        letterToUpperCase(false);
        capsLockBtn.classList.toggle('capslock-active');
      }
    }

    if (e.code === 'Tab') {
      e.preventDefault();
      this.output.value += '\t';
    }

    if (e.code === 'AltLeft') {
      this.altCtrl = true;
    }

    if (e.code === 'ControlLeft' && this.altCtrl) {
      if (this.keyLang === 'en') {
        this.changeLanguage('ru');
        this.keyLang = 'ru';
      } else {
        this.changeLanguage('en');
        this.keyLang = 'en';
      }
      this.altCtrl = false;
    }

    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
      this.isShiftPressed = true;
      this.shiftPress(true);
    }
  }

  handleOnKeyUp(e) {
    const activeKey = document.querySelector(`*[data-code=${e.code}]`);
    activeKey.classList.remove('active');

    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
      this.shiftPress(false);
      this.isShiftPressed = false;
    }
  }

  handleOnMouseDown(e) {
    e.preventDefault();
    this.output.focus();
    if (e.target.dataset.code === 'CapsLock') {
      const capsLockBtn = document.querySelector('.capslock');
      if (this.isCapsLock) {
        capsLockBtn.classList.toggle('capslock-active');
      }
    }

    if (e.currentTarget) {
      this.addActiveClass(e.currentTarget);
    }

    if (this.fireKeyCodes.includes(e.target.dataset.code)) {
      this.fireKeys(e.target);
    }

    if (this.changeableKeys.includes(e.currentTarget.dataset.code)) {
      this.changeableKeyWrite(e.currentTarget);
    }

    if (e.target.dataset.code === 'ShiftLeft' || e.target.dataset.code === 'ShiftRight') {
      this.shiftPress(true);
    }
  }

  handleOnMouseUp(e) {
    if (e.currentTarget) {
      this.addActiveClass(e.currentTarget);
    }
    // e.target.classList.remove('active');

    if (e.target.dataset.code === 'ShiftLeft' || e.target.dataset.code === 'ShiftRight') {
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
          if (this.changeableKeys.includes(el.code)) {
            const changeableKey = document.querySelector(`*[data-code=${el.code}]`);
            const main = changeableKey.querySelector('.main');
            const sub = changeableKey.querySelector('.sub');
            main.textContent = el.small;
            sub.textContent = el.shift;
          } else if (el.code === item.dataset.code) {
            item.innerHTML = el.small;
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

  // eslint-disable-next-line class-methods-use-this
  addActiveClass(el) {
    el.classList.toggle('active');
  }
}
