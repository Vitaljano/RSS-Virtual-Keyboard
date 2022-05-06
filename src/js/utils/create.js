export default function create(tag, text, className, ...dataAtr) {
  let element = null;
  try {
    element = document.createElement(tag);
  } catch {
    throw Error('Unable create HTML ELEMENT! Wrong tag name');
  }

  if (className) element.classList.add(...className.split(' '));

  if (dataAtr.length) {
    dataAtr.forEach(([atr, atrValue]) => {
      element.setAttribute(atr, atrValue);
    });
  }
  element.textContent = text;
  return element;
}
