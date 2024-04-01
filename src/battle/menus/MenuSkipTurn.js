export default class MenuSkipTurn {
  AP_POINTS_REQUIRED = 1;

  constructor(menu, board) {
    this.menu = menu;
    this.board = board;
    this.character = this.menu.character;
  }

  init(parent) {
    const li = document.createElement('li');
    li.innerHTML = 'Skip Turn';

    if (this.menu.character.ap >= this.AP_POINTS_REQUIRED) {
      li.onclick = () => {
        this.board.soundManager.play('open');
        this.menu.on('skip');
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

  on() {
    this.character.useAp(this.character.maxAp);
    this.character.skipTurn = true;
    this.menu._actionsOff();
  }

  _getLine() {
    const line = document.createElement('img');
    line.src = '/images/Battle/MenuLine.png';

    return line;
  }
}
