import { Quiz } from './quiz.mjs';
const el = id => document.getElementById(id);
let game;
function render() {
  const number = String(game.number).padStart(2, '0');
  el('number').textContent = el('step').textContent = number;
  el('total').textContent = game.pool.length;
  el('flag').src = game.current.flag;
  el('flag').hidden = false;
  el('score').textContent = game.score;
  el('streak').textContent = game.streak;
  el('feedback').textContent = '';
  el('next').hidden = true;
  const buttons = game.options.map((country, index) => {
    const button = document.createElement('button');
    button.className = 'choice';
    button.dataset.code = country.code;
    const letter = document.createElement('span');
    letter.className = 'letter';
    letter.textContent = 'ABC'[index];
    letter.setAttribute('aria-hidden','true');
    button.append(letter, country.name);
    button.onclick = () => choose(country.code);
    return button;
  });
  el('choices').replaceChildren(...buttons);
}
function choose(code) {
  const correct = game.answer(code);
  if (correct === undefined) return;
  for (const button of el('choices').children) {
    button.disabled = true;
    const right = button.dataset.code === game.current.code;
    if (right || button.dataset.code === code) {
      button.classList.add(right ? 'right' : 'wrong');
      const mark = document.createElement('span');
      mark.className = 'mark';
      mark.textContent = right ? '○' : '×';
      button.append(mark);
    }
  }
  el('score').textContent = game.score;
  el('streak').textContent = game.streak;
  el('feedback').textContent = correct ? '○ せいかい！' : '× おしい！ こたえは「' + game.current.name + '」だよ';
  el('next').hidden = false;
  el('next').focus({preventScroll:true});
}
try {
  const response = await fetch('./data/countries.json');
  const countries = await response.json();
  function restart() {
    game = new Quiz(countries, el('level').value);
    render();
  }
  restart();
  el('level').onchange = restart;
  el('next').onclick = () => {
    game.next();
    render();
    el('question').focus();
  };
} catch {
  el('feedback').textContent = 'もんだいを よみこめなかったよ。もういちど ひらいてね。';
}
if ('serviceWorker' in navigator) {
  try {
    const registration = await navigator.serviceWorker.register('./sw.js');
    const installing = registration.installing;
    if (installing) {
      el('offline').textContent = 'オフラインの じゅんびちゅう…';
      installing.addEventListener('statechange', () => {
        if (installing.state === 'redundant') el('offline').textContent = 'オフラインの じゅんびに しっぱいしたよ';
      });
    }
    await navigator.serviceWorker.ready;
    el('offline').textContent = '✓ オフラインでも あそべるよ';
  } catch {
    el('offline').textContent = 'オフラインの じゅんびに しっぱいしたよ';
  }
}
