import anime from 'animejs';
import MenuAttack from './menus/MenuAttack';
import MenuMovement from './menus/MenuMovement';
import MenuMagic from './menus/MenuMagic';
import MenuSkills from './menus/MenuSkills';
import MenuItems from './menus/MenuItems';
import MenuSkipTurn from './menus/MenuSkipTurn';

export default class Menu {
  constructor(board) {
    this.board = board;
    this.action = document.getElementById('menu-action');
    this.actionList = this.action.getElementsByTagName('ul')[0];
    this.skills = document.getElementById('menu-skills');
    this.skillsList = this.skills.getElementsByTagName('ul')[0];
    this.items = document.getElementById('menu-items');
    this.itemsList = this.items.getElementsByTagName('ul')[0];
    this.magic = document.getElementById('menu-magic');
    this.magicList = this.magic.getElementsByTagName('ul')[0];
    this.character = null;
    this.disable();
    this.currentSpot = null;
    this.isOn = false;
    this.isAnimationDone = false;
    this.nav = {};
  }

  build(character) {
    this.character = character;
    this.buildActionMenu();
  }

  buildActionMenu() {
    this.actionList.innerHTML = '';

    // Attack
    this.nav.attack = new MenuAttack(this, this.board);
    this.nav.attack.init(this.actionList);

    // Move
    this.nav.move = new MenuMovement(this, this.board);
    this.nav.move.init(this.actionList);

    // Magic
    this.nav.magic = new MenuMagic(this, this.board, this.magic, this.magicList);
    this.nav.magic.init(this.actionList);

    // Special Skills
    this.nav.skills = new MenuSkills(this, this.board, this.skills, this.skillsList);
    this.nav.skills.init(this.actionList);

    // Items
    this.nav.items = new MenuItems(this, this.board, this.items, this.itemsList);
    this.nav.items.init(this.actionList);

    // Skip Turn
    this.nav.skip = new MenuSkipTurn(this, this.board);
    this.nav.skip.init(this.actionList);

  }

  disable() {
    this.action.style.opacity = 0;
    this.action.style.display = 'none';
  }

  on(option, spot) {
    this.hide();
    if (option === 'actions') {
      this._actionsOn(spot);
    } else {
      if (this.nav[option]) {
        this.nav[option].on();
      }
    }
  }

  hide() {
    this.nav.magic.hide();
    this.nav.skills.hide();
    this.nav.items.hide();
  }

  back() {
    if (this.currentMenu) {
      if (this.currentMenu.endsWith('select')) {
        this.nav[this.currentMenu.split('-')[0]].offTarget();
      } else if (this.nav[this.currentMenu]) {
        this.nav[this.currentMenu].off();
      } else if (this.currentMenu === 'moving') {
        this.nav.move.off();
      } else if (this.currentMenu === 'attacking') {
        this.nav.attack.off();
      } else if (this.currentMenu === 'hit') {
        this.nav.attack.hitOff();
      } else {
        this._actionsOff();
      }
    }
  }

  _actionsOn(spot) {
    if (this.isOn && !this.isAnimationDone) return;

    this.currentSpot = spot;
    document.getElementById(`spot_${this.currentSpot.id}`).classList.remove('spot-marked');
    document.getElementById(`spot_${this.currentSpot.id}`).classList.add('spot-active');
    this.character.dash.active();
    this.isOn = true;
    this.isAnimationDone = false;
    this.currentMenu = 'actions';
    this.onEffect(() => {
      this.isAnimationDone = true;
    });
  }

  onEffect(cb = () => {}) {
    this.action.style.left = `${this.currentSpot.x}px`;
    this.action.style.top = `${this.currentSpot.y - 50}px`;
    this.action.style.display = 'block';
    this.board.soundManager.play('open');
    anime({
      targets: this.action,
      opacity: [0, 1],
      left: this.currentSpot.x + 90,
      top: this.currentSpot.y - 50,
      duration: 600,
      easing: 'easeOutQuint',
      complete: () => {
        cb();
        this.board.hover.disable();
      }
    });
  }

  _actionsOff() {
    if (!this.isOn) return;

    this.isAnimationDone = false;
    this.character.dash.inactive();
    this.board.turn.checkTurnsEnd();
    document.getElementById(`spot_${this.currentSpot.id}`).classList.remove('spot-active');
    if (this.character.position === this.currentSpot.id) {
      document.getElementById(`spot_${this.currentSpot.id}`).classList.add('spot-marked');
    }
    this.offEffect(() => {
      this.board.clearAvailableSpots();
      this.isOn = false;
      this.isAnimationDone = true;
      this.currentSpot = null;
    })
  }

  offEffect(cb = () => { }) {
    this.board.soundManager.play('open');
    anime({
      targets: this.action,
      opacity: 0,
      left: this.currentSpot.x + 90 + 50,
      top: this.currentSpot.y - 50,
      duration: 600,
      easing: 'easeOutQuint',
      complete: () => {
        this.action.style.display = 'none';
        cb();
      }
    });
  }
}
