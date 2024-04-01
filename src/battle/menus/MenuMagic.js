import MenuBase from "./MenuBase";

export default class MenuMagic extends MenuBase {
  MENU_NAME = 'magic';
  AP_POINTS_REQUIRED = 7;

  constructor(menu, board, box, list) {
   super(menu, board, box, list);
  }

  init(parent) {
    const li = document.createElement('li');
    li.innerHTML = 'Magic';
    if (this.menu.character.ap >= this.AP_POINTS_REQUIRED) {
      li.onclick = () => {
        this.board.soundManager.play('open');
        this.menu.on('magic');
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
      const magics = this.menu.character.magics.slice(i * 5, (i * 5) + 5);

      const li = document.createElement('li');
      magics.forEach((magic) => {
        const a = document.createElement('a');
        a.innerHTML = magic.name.substring(0, 15);
        a.href = 'javascript:;';
        li.appendChild(a);

        const span = document.createElement('span');
        span.classList.add('small');
        span.innerHTML = `${magic.mp} MP`;
        a.appendChild(span);
        a.appendChild(this._getLine());

        a.onmouseenter = () => {
          if (this.menu.isAnimationDone) {
            this.board.soundManager.play('cursor');
            this.description.innerHTML = `<b>${magic.name}</b> - ${magic.mp} MP<br>${magic.description}`;
            this.showDescription();
          }
        };
        a.onmouseleave = () => {
          if (this.menu.isAnimationDone) {
            this.hideDescription();
          }
        }
        a.onclick = () => { this.selectTarget(magic, 'cast'); }
      });

      this.list.appendChild(li);
    }
  }

  cast(magic, targets) {
    console.log(`${this.menu.character.name} is casting magic: ${magic.name} on ${targets.map(t => t.name).join(', ')}`);
    this.menu.character.useAp(this.AP_POINTS_REQUIRED);
  }

  get totalItems() {
    return this.menu.character.magics.length;
  }

  get offsetTop() {
    return -52;
  }
}
