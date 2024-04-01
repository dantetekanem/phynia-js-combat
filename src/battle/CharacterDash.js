import anime from 'animejs';
import BaseDash from './BaseDash';

export default class CharacterDash extends BaseDash {
  constructor(character) {
    super(character);
    this.listMenu = document.getElementsByClassName('left-menu')[0];
  }

  build() {
    const box = document.createElement('div');
    box.classList.add('character-box');

    const statuses = document.createElement('div');
    statuses.classList.add('statuses');
    this.refs.statuses = statuses;
    box.appendChild(statuses);

    const rightSide = document.createElement('div');
    rightSide.classList.add('right-side');
    box.appendChild(rightSide);

    // Name
    const name = document.createElement('div');
    name.classList.add('name');
    this.refs.name = name;
    rightSide.appendChild(name);

    // Action Points (AP)
    const aps = document.createElement('div');
    aps.classList.add('ap');
    this.refs.aps = aps;
    rightSide.appendChild(aps);

    // HP
    const attrsHp = document.createElement('div');
    attrsHp.classList.add('attrs', 'hp');
    this.refs.hp = {};

    const currentHp = document.createElement('div');
    currentHp.classList.add('current');
    this.refs.hp.current = currentHp;
    attrsHp.appendChild(currentHp);

    const hpLine = document.createElement('div');
    hpLine.innerHTML = '/';
    hpLine.classList.add('line');
    attrsHp.appendChild(hpLine);

    const totalHp = document.createElement('div');
    totalHp.classList.add('total');
    this.refs.hp.total = totalHp;
    attrsHp.appendChild(totalHp);

    rightSide.appendChild(attrsHp);

    // MP
    const attrsMp = document.createElement('div');
    attrsMp.classList.add('attrs', 'mp');
    this.refs.mp = {};

    const currentMp = document.createElement('div');
    currentMp.classList.add('current');
    this.refs.mp.current = currentMp;
    attrsMp.appendChild(currentMp);

    const mpLine = document.createElement('div');
    mpLine.innerHTML = '/';
    mpLine.classList.add('line');
    attrsMp.appendChild(mpLine);

    const totalMp = document.createElement('div');
    totalMp.classList.add('total');
    this.refs.mp.total = totalMp;
    attrsMp.appendChild(totalMp);

    rightSide.appendChild(attrsMp);

    // Gauge
    const gauge = document.createElement('div');
    gauge.classList.add('gauge');
    this.refs.gauge = {};

    const text = document.createElement('div');
    text.classList.add('pct');
    text.innerHTML = '0%';
    this.refs.gauge.text = text;
    gauge.appendChild(text);

    const barBase = document.createElement('div');
    barBase.classList.add('bar-base');

    const currentGauge = document.createElement('div');
    currentGauge.classList.add('current-bar');
    currentGauge.style.width = '0%';
    this.refs.gauge.current = currentGauge;
    barBase.appendChild(currentGauge);
    gauge.appendChild(barBase);
    //
    rightSide.appendChild(gauge);

    //
    this.refs.box = box;
    this.listMenu.appendChild(box);
    this.setInfos();
  }

  setInfos() {
    this.refs.name.innerHTML = this.character.name;
    this.refs.aps.innerHTML = `${this.character.ap}/${this.character.maxAp} <span>AP</span>`;
    this.refs.hp.current.innerHTML = String(this.character.hp).padStart(4, '0');
    this.refs.hp.total.innerHTML = String(this.character.maxHp).padStart(4, '0');
    this.refs.mp.current.innerHTML = String(this.character.mp).padStart(4, '0');
    this.refs.mp.total.innerHTML = String(this.character.maxMp).padStart(4, '0');
    this.refs.gauge.text.innerHTML = `${this.character.gauge}%`;
    this.refs.gauge.current.style.width = `${this.character.gauge}%`;

    // statuses
    this.setEffects();
  }

  updateHP(newValue) {
    let copy = { ...this.character };
    if (newValue < 0) newValue = 0;
    if (newValue > copy.maxHp) newValue = copy.maxHp;
    let diff = copy.hp - newValue;
    let color = diff < 0 ? '#3eb517' : '#c85050';

    // color
    anime({
      targets: this.refs.hp.current,
      color: color,
      delay: 1000,
      duration: 900,
      complete: () => {
        anime({
          targets: this.refs.hp.current,
          color: this.hpRisky(newValue) ? color : '#ffffff',
          duration: 700,
          complete: () => {
            if (this.hpRisky(newValue)) {
              this.refs.hp.current.classList.add('red');
            } else {
              this.refs.hp.current.classList.remove('red'); 
            }
          }
        });
      }
    });
    // text
    anime({
      targets: copy,
      hp: newValue,
      duration: 1000,
      easing: 'linear',
      round: 1,
      delay: 1000,
      update: () => {
        this.refs.hp.current.innerHTML = String(copy.hp).padStart(4, '0');
      },
      complete: () => {
        this.refs.hp.current.innerHTML = String(this.character.hp).padStart(4, '0');
      }
    });
  }

  updateMP(newValue) {
    let copy = { ...this.character };
    if (newValue < 0) newValue = 0;
    if (newValue > copy.maxMp) newValue = copy.maxMp;
    let diff = copy.mp - newValue;
    let color = diff < 0 ? '#3eb517' : '#c85050';

    // color
    anime({
      targets: this.refs.mp.current,
      color: color,
      delay: 1000,
      duration: 900,
      complete: () => {
        anime({
          targets: this.refs.mp.current,
          color: this.mpRisky(newValue) ? color : '#ffffff',
          duration: 700,
          complete: () => {
            if (this.mpRisky(newValue)) {
              this.refs.mp.current.classList.add('red');
            } else {
              this.refs.mp.current.classList.remove('red');
            }
          }
        });
      }
    });
    // text
    anime({
      targets: copy,
      mp: newValue,
      duration: 1000,
      easing: 'linear',
      round: 1,
      delay: 1000,
      update: () => {
        this.refs.mp.current.innerHTML = String(copy.mp).padStart(4, '0');
      },
      complete: () => {
        this.refs.mp.current.innerHTML = String(this.character.mp).padStart(4, '0');
      }
    });
  }

  updateGauge(newValue) {
    let copy = { ...this.character };
    if (newValue < 0) newValue = 0;
    if (newValue > 100) newValue = 100;

    anime({
      targets: this.refs.gauge.current,
      width: newValue,
      duration: 600,
      easing: 'linear',
      round: 1,
      delay: 800,
      complete: () => {
        if (newValue === 100) {
          this.refs.gauge.current.classList.add('bar-is-full');
        } else {
          this.refs.gauge.current.classList.remove('bar-is-full');
        }
      }
    });

    // text
    anime({
      targets: copy,
      gauge: newValue,
      duration: 1000,
      easing: 'linear',
      round: 1,
      delay: 1000,
      update: () => {
        this.refs.gauge.text.innerHTML = `${copy.gauge}%`;
      }
    });
  }
}
