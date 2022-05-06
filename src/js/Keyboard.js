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
    this.fireKeyCodes = ['Backspace', 'Delete', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'CapsLock'];
    this.isCapsLock = false;
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

    if (this.isCapsLock) {
      capsLockBtn.classList.toggle('capslock-active');
    }

    if (this.isCapsLock) {
      letterToUpperCase(true);
    } else {
      letterToUpperCase(false);
    }
  }

  handleOnKeyUp() {
    console.log(this);
    // this.frame = document.querySelector('.frame');
    // let activeBtn = this.frame.querySelector(`*[data-code="${e.keyCode}"]`);
    // activeBtn.classList.remove('active');
  }

  handleOnMouseDown(e) {
    this.output.focus();

    if (this.fireKeyCodes.includes(e.target.dataset.code)) {
      this.fireKeys(e.target);
    }

    // this.output.value += String.fromCharCode(e.target.dataset.code);
  }

  letterKeys() {
    const letter = document.querySelectorAll('.letter');

    letter.forEach((el) => {
      el.addEventListener('mousedown', (e) => {
        this.output.value += e.target.textContent;
      });
    });
  }

  handleOnMouseUp(e) {
    e.target.classList.remove('active');
    this.output.focus();
  }
}
