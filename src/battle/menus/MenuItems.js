import MenuBase from "./MenuBase";
import * as utils from '../utils';

export default class MenuItems extends MenuBase {
  MENU_NAME = 'items';
  AP_POINTS_REQUIRED = 5;

  constructor(menu, board, box, list) {
    super(menu, board, box, list);
  }

  init(parent) {
    const li = document.createElement('li');
    li.innerHTML = 'Items';
    if (this.menu.character.ap >= this.AP_POINTS_REQUIRED) {
      li.onclick = () => {
        this.board.soundManager.play('open');
        this.menu.on('items');
      }

      li.onmouseenter = () => {
        if (this.menu.isAnimationDone) {
          this.board.soundManager.play('cursor');
        }
      }
    } else {
      li.classList.add('inactive');
    }

    li.appendChild(this._getLine());
    parent.appendChild(li);
  }

  populate() {
    for (let i = 0; i < Math.ceil(this.totalItems); i++) {
      const items = this.menu.character.items.slice(i * 5, (i * 5) + 5);
      const li = document.createElement('li');
      items.forEach((item) => {
        const a = document.createElement('a');
        a.innerHTML = item.name;
        a.href = 'javascript:;';
        li.appendChild(a);

        const span = document.createElement('span');
        span.classList.add('small');
        span.innerHTML = `${item.qty} QTY`;
        a.appendChild(span);
        a.appendChild(this._getLine());

        a.onmouseenter = () => {
          if (this.menu.isAnimationDone) {
            this.board.soundManager.play('cursor');
            this.description.innerHTML = item.description;
            this.showDescription();
          }
        };
        a.onmouseleave = () => {
          if (this.menu.isAnimationDone) {
            this.hideDescription();
          }
        }
        a.onclick = () => { this.selectTarget(item, 'use'); }
      });
      this.list.appendChild(li);
    }
  }

  use(item, targets) {
    console.log(`${this.menu.character.name} is using ${item.name} on ${targets.map(t => t.name).join(', ')}`);
    this.menu.character.useAp(this.AP_POINTS_REQUIRED);

    utils.wait(200).then(() => {
      for (const target of targets) {
        let spot = this.board.findSpotById(target.position);
        this.board.animator.play(item.animation, spot);
        this.board.damage.show(spot, 50, 0, true);
      }
    });
  }

  get totalItems() {
    return this.menu.character.items.length;
  }

  get offsetTop() {
    return -1;
  }
}
