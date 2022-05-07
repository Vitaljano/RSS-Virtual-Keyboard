import create from './utils/create';

const controlButtons = [
  'Backspace',
  'Delete',
  'Tab',
  'CapsLock',
  'ShiftLeft',
  'ShiftRight',
  'ControlLeft',
  'AltLeft',
  'Space',
  'AltRight',
  'ControlRight',
  'ArrowLeft',
  'ArrowUp',
  'ArrowDown',
  'ArrowRight',
  'Win',
  'Enter',
];

export default class Key {
  constructor({
    small, shift, code, keycode,
  }, handlers) {
    this.small = small;
    this.shift = shift;
    this.code = code;
    this.keycode = keycode;

    let className = 'key';

    if (controlButtons.includes(this.code)) {
      className += ` ${this.code.toLowerCase()}`;
      className += ' control-key';
    }

    if (shift && !code.includes('Key')) {
      const children = [];
      children.push(create('span', this.shift, 'sub'));
      children.push(create('span', this.small, 'main'));
      this.key = create('div', '', className, ['data-code', this.code]);
      this.key.addEventListener('mousedown', handlers.handleOnMouseDown);
      this.key.addEventListener('mouseup', handlers.handleOnMouseUp);

      this.key.append(...children);
    } else if (code.includes('Key')) {
      className += ' letter';
      this.key = create('div', this.small, className, ['data-code', this.code]);
      this.key.addEventListener('mousedown', handlers.handleOnMouseDown);
      this.key.addEventListener('mouseup', handlers.handleOnMouseUp);
    } else {
      this.key = create('button', this.small, className, ['data-code', this.code]);
      this.key.addEventListener('mousedown', handlers.handleOnMouseDown);
      this.key.addEventListener('mouseup', handlers.handleOnMouseUp);
    }
  }
}
