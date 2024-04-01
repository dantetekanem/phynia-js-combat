import anime from 'animejs';
import * as utils from '../utils';

export default class MenuHit {
  constructor(board, menu, attack, spot) {
    this.board = board;
    this.menu = menu;
    this.character = menu.character;
    this.attack = attack;
    this.spot = spot;
    this.box = document.getElementById('menu-damage');
    this.list = this.box.getElementsByTagName('ul')[0];
  }

  on() {
    this.box.style.left = `${this.spot.x - 12}px`;
    this.box.style.top = `${this.spot.y + 20}px`;
    this.box.style.display = 'block';
    this.build();
    this.board.soundManager.play('open');
    anime({
      targets: this.box,
      opacity: [0, 1],
      left: this.spot.x - 12,
      top: this.spot.y + 80,
      duration: 600,
      easing: 'easeOutQuint',
      complete: () => {
        // cb();
      }
    });
  }

  off() {
    this.board.soundManager.play('open');
    anime({
      targets: this.box,
      opacity: [1, 0],
      left: this.spot.x - 12,
      top: this.spot.y + 80 + 40,
      duration: 500,
      easing: 'easeOutQuint',
      complete: () => {
        this.box.style.display = 'none';
      }
    });
  }

  build() {
    this.list.innerHTML = '';

    if (this.character.ap <= 0) {
      this.attack.hitOff();
      this.attack.off();
      this.menu._actionsOff();
    }

    for (const hit of this.getHitList()) {
      const li = document.createElement('li');
      li.innerHTML = `${hit.text} - ${hit.pct}%`;
      if (hit.risk) li.classList.add('risk');
      li.appendChild(this._getLine());

      li.onclick = () => {
        this.board.soundManager.play('open');
        this.attack.runHit(hit);
      }

      li.onmouseenter = () => {
        if (this.menu.isAnimationDone) {
          this.board.soundManager.play('cursor');
        }
      }

      this.list.appendChild(li);
    }
  }

  getHitList() {
    const hits = this.character.hits(this.attack.target);
    const list = [];

    if (this.character.ap >= 1) {
      list.push({ text: 'HIT 1', pct: hits.weak, risk: this.character.ap === 1, type: 'weak', apCost: 1, atkPoints: 1 });
    }
    if (this.character.ap >= 2) {
      list.push({ text: 'HIT 2', pct: hits.strong, risk: this.character.ap === 2, type: 'strong', apCost: 2, atkPoints: 3 });
    }
    if (this.character.ap >= 3) {
      list.push({ text: 'HIT 3', pct: hits.fierce, risk: this.character.ap === 3, type: 'fierce', apCost: 3, atkPoints: 7 });
    }

    return list;
  }

  _getLine() {
    const line = document.createElement('img');
    line.src = '/images/Battle/MenuLine.png';

    return line;
  }
}