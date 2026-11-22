const box = document.querySelector('#searchBox');
const input = document.querySelector('#query');
const cards = [...document.querySelectorAll('.card')];
document.querySelector('#find').addEventListener('click', () => {
  box.hidden = false;
  document.querySelector('#catalog').scrollIntoView();
  input.focus({ preventScroll: true });
});
input.addEventListener('input', () => {
  const term = input.value.trim().toLowerCase();
  cards.forEach(card => { card.hidden = !card.textContent.toLowerCase().includes(term); });
  document.querySelector('#empty').hidden = cards.some(card => !card.hidden);
});
