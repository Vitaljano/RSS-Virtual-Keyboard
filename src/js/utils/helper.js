export default function letterToUpperCase(isTrue) {
  const lowerLetters = document.querySelectorAll('.letter');
  lowerLetters.forEach((letter) => {
    const tmp = letter.textContent;
    if (isTrue) {
      letter.textContent = tmp.toUpperCase();
    } else {
      letter.textContent = tmp.toLowerCase();
    }
  });
}
