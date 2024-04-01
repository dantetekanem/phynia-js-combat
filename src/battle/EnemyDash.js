import anime from 'animejs';
import * as utils from './utils';
import Enemy from './Enemy';
import BaseDash from './BaseDash';

export default class EnemyDash extends BaseDash {
  constructor(character) {
    super(character);
    this.listMenu = document.getElementsByClassName('right-menu')[0];
  }

  build() {
    const box = document.createElement('div');
    box.classList.add('character-box');

    const leftSide = document.createElement('div');
    leftSide.classList.add('left-side');
    box.appendChild(leftSide);

    const name = document.createElement('div');
    name.classList.add('name');
    this.refs.name = name;
    leftSide.appendChild(name);

    // HP
    const hpBar = document.createElement('div');
    hpBar.classList.add('bar', 'hp');
    this.refs.hp = {};

    const textHp = document.createElement('div');
    textHp.classList.add('pct');
    textHp.innerHTML = '0%';
    this.refs.hp.text = textHp;
    hpBar.appendChild(textHp);

    const barBaseHp = document.createElement('div');
    barBaseHp.classList.add('bar-base');

    const currentHp = document.createElement('div');
    currentHp.classList.add('current-bar');
    currentHp.style.width = '0%';
    this.refs.hp.current = currentHp;
    barBaseHp.appendChild(currentHp);
    hpBar.appendChild(barBaseHp);

    leftSide.appendChild(hpBar);

    // MP
    const mpBar = document.createElement('div');
    mpBar.classList.add('bar', 'mp');
    this.refs.mp = {};

    const textMp = document.createElement('div');
    textMp.classList.add('pct');
    textMp.innerHTML = '0%';
    this.refs.mp.text = textMp;
    mpBar.appendChild(textMp);

    const barBaseMp = document.createElement('div');
    barBaseMp.classList.add('bar-base');

    const currentMp = document.createElement('div');
    currentMp.classList.add('current-bar');
    currentMp.style.width = '0%';
    this.refs.mp.current = currentMp;
    barBaseMp.appendChild(currentMp);
    mpBar.appendChild(barBaseMp);

    leftSide.appendChild(mpBar);

    // Gauge
    const gauge = document.createElement('div');
    gauge.classList.add('bar', 'gauge');
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
    leftSide.appendChild(gauge);

    const statuses = document.createElement('div');
    statuses.classList.add('statuses');
    this.refs.statuses = statuses;
    box.appendChild(statuses);

    //
    this.refs.box = box;
    this.listMenu.appendChild(box);
    this.setInfos();
  }

  setInfos() {
    this.refs.name.innerHTML = this.character.name;
    this.refs.hp.text.innerHTML = `${this.character.hpPct}%`;
    this.refs.hp.current.style.width = `${this.character.hpPct}%`;
    this.refs.mp.text.innerHTML = `${this.character.mpPct}%`;
    this.refs.mp.current.style.width = `${this.character.mpPct}%`;
    this.refs.gauge.text.innerHTML = `${this.character.gauge}%`;
    this.refs.gauge.current.style.width = `${this.character.gauge}%`;

    // statuses
    this.refs.statuses.innerHTML = '';
    for (const effect of this.character.effects) {
      let ef = document.createElement('img');
      ef.src = effect.img;
      this.refs.statuses.appendChild(ef);
    }
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

  updateHP(newValue) {
    let copy = new Enemy({ ...this.character });
    let newValuePct = utils.clamp(Math.round(newValue / this.character.maxHp * 100), 0, 100);
    let diff = copy.hp - newValue;
    let color = diff < 0 ? '#3eb517' : '#c85050';

    anime({
      targets: this.refs.hp.current,
      width: newValuePct,
      duration: 600,
      easing: 'linear',
      round: 1,
      delay: 800,
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
        this.refs.hp.text.innerHTML = `${copy.hpPct}%`;
      }
    });

    // color
    anime({
      targets: this.refs.hp.text,
      color: color,
      delay: 1000,
      duration: 900,
      complete: () => {
        anime({
          targets: this.refs.hp.text,
          color: this.hpRisky(newValue) ? color : '#ffffff',
          duration: 700,
          complete: () => {
            if (this.hpRisky(newValue)) {
              this.refs.hp.text.classList.add('red');
            } else {
              this.refs.hp.text.classList.remove('red');
            }
          }
        });
      }
    });
  }

  updateMP(newValue) {
    let copy = new Enemy({ ...this.character });
    let newValuePct = utils.clamp(Math.round(newValue / this.character.maxMp * 100), 0, 100);
    let diff = copy.mp - newValue;
    let color = diff < 0 ? '#3eb517' : '#c85050';

    anime({
      targets: this.refs.mp.current,
      width: newValuePct,
      duration: 600,
      easing: 'linear',
      round: 1,
      delay: 800,
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
        this.refs.mp.text.innerHTML = `${copy.mpPct}%`;
      }
    });

    // color
    anime({
      targets: this.refs.mp.text,
      color: color,
      delay: 1000,
      duration: 900,
      complete: () => {
        anime({
          targets: this.refs.mp.text,
          color: this.mpRisky(newValue) ? color : '#ffffff',
          duration: 700,
          complete: () => {
            if (this.mpRisky(newValue)) {
              this.refs.mp.text.classList.add('red');
            } else {
              this.refs.mp.text.classList.remove('red');
            }
          }
        });
      }
    });
  }
}
