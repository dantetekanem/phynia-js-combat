import anime from 'animejs';

export default class BaseDash {
  constructor(character) {
    this.character = character;
    this.refs = {};
  }

  remove() {
    anime({
      target: this.refs.box,
      duration: 500,
      opacity: 0,
      scale: 0,
      complete: () => {
        this.refs.box.remove();
      }
    });
  }

  setEffects() {
    if (!this.character?.effects?.length > 0) {
      this.refs.statuses.innerHTML = '';
      return;
    }

    this.refs.statuses.innerHTML = '';
    for (const effect of this.character.effects) {
      let ef = document.createElement('div');
      ef.style.background = `url(${effect.img})`;
      ef.classList.add('tooltip', 'fade');
      ef.dataset.title = effect.description;
      this.refs.statuses.appendChild(ef);
    }
  }

  getPct(base, total) {
    return Math.round(base / total * 100);
  }

  active() {
    this.refs.box.classList.add('active');
  }

  inactive() {
    this.refs.box.classList.remove('active');
  }

  hpRisky(newValue) {
    return (newValue / this.character.maxHp * 100) <= 20;
  }

  mpRisky(newValue) {
    return (newValue / this.character.maxMp * 100) <= 20;
  }
}
