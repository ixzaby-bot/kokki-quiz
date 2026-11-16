const easy = 'jp us gb fr de it cn kr br ca au in es mx ch se ar za eg gr'.split(' ');
const normal = [...easy, ...'id th vn sg my ph nz fi no dk is ie nl be at pt pl cz ua ru tr sa ae il ke ma ng gh et co cl pe uy jm cu cr pk bd np lk'.split(' ')];
export const levels = {easy: 'かんたん', normal: 'ふつう', world: 'せかい', expert: 'ちょうむずかしい'};
const designs = [
  'ro td ad md', 'id mc pl sg', 'fr it ie ci be', 'nl lu ru py hr sk si rs',
  'dk no is se fi', 'nz au fj tv', 'us lr my', 'jp bd pw', 'de be ug',
  'co ec ve', 'jo ps sd kw ae', 'eg sy iq ye', 'bh qa', 'ch ge',
  'ml gn sn cm', 'gh bo lt', 'ar uy', 'gr il', 'ir hu tj', 'hn ni sv',
  'td fr', 'sa pk mr dz', 'tr tn', 'at lv', 'ht li'
].map(group => group.split(' '));

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export class Quiz {
  constructor(countries, level) {
    const codes = level === 'easy' ? easy : level === 'normal' ? normal : null;
    this.pool = countries.filter(c => !codes || codes.includes(c.code));
    this.level = level;
    this.deck = [];
    this.score = 0;
    this.streak = 0;
    this.next();
  }
  next() {
    if (this.current && !this.answered) return;
    if (!this.deck.length) {
      this.deck = shuffle(this.pool);
      if (this.deck.at(-1) === this.current) this.deck.reverse();
    }
    this.current = this.deck.pop();
    this.number = this.pool.length - this.deck.length;
    const others = shuffle(this.pool.filter(c => c !== this.current));
    if (this.level === 'expert') {
      const groups = designs.filter(g => g.includes(this.current.code));
      const rank = c => 4 * Number(groups.some(g => g.includes(c.code))) +
        2 * Number(c.subregion === this.current.subregion) + Number(c.region === this.current.region);
      others.sort((a, b) => rank(b) - rank(a));
    }
    this.options = shuffle([this.current, ...others.slice(0, 2)]);
    this.answered = false;
  }
  answer(code) {
    if (this.answered || !this.options.some(c => c.code === code)) return;
    this.answered = true;
    const correct = this.current.code === code;
    if (correct) this.score++;
    this.streak = correct ? this.streak + 1 : 0;
    return correct;
  }
}
