
import anime from 'animejs';
export default class MenuBase {
  MENU_NAME = '';

  constructor(menu, board, box, list) {
    this.menu = menu;
    this.board = board;
    this.box = box;
    this.list = list;
    this.pagination = this.box.getElementsByClassName('pagination')[0];
    this.description = this.box.getElementsByClassName('description')[0];
    this.descriptionWindow = false;
    this.targets = [];
  }

  on() {
    if (!this.menu.isAnimationDone) return;

    const spot = this.menu.currentSpot;
    this.box.style.left = `${spot.x + 131}px`;
    this.box.style.top = `${spot.y + this.offsetTop}px`;
    this.box.style.display = 'block';
    this.list.innerHTML = '';
    this.list.style.display = 'block';
    this.description.style.display = 'block';
    this.description.style.opacity = 0;
    this.board.soundManager.play('open');
    this.menu.isAnimationDone = false;
    this.menu.currentMenu = this.MENU_NAME;
    this.list.style.width = `${parseInt(this.pages * 126.4)}px`;
    this.setupPagination();
    this.populate();
    this.setPage();

    anime({
      targets: this.box,
      opacity: [0, 1],
      left: spot.x + 131 + 90,
      top: spot.y + this.offsetTop,
      duration: 600,
      easing: 'easeOutQuint',
      complete: () => {
        this.menu.isAnimationDone = true;
      }
    });
  }

  off() {
    this.board.soundManager.play('open');
    anime({
      targets: this.box,
      opacity: 0,
      left: this.menu.currentSpot.x + 131 + 90 + 50,
      top: this.menu.currentSpot.y + this.offsetTop,
      duration: 600,
      easing: 'easeOutQuint',
      complete: () => {
        this.hide();
        this.menu.isAnimationDone = true;
      }
    });
  }

  hide() {
    this.box.style.display = 'none';
    this.list.style.display = 'none';
    this.description.style.display = 'none';
    this.description.style.opacity = 0;
  }

  setupPagination() {
    this.nextPage = this.pagination.getElementsByClassName('next')[0];
    this.prevPage = this.pagination.getElementsByClassName('prev')[0];
    this.nextPage.classList.add('inactive');
    this.prevPage.classList.add('inactive');
    this.currentPage = 1;

    if (this.pages <= 2) {
      return;
    }

    this.nextPage.classList.remove('inactive');
    this.nextPage.onclick = () => {
      if (this.currentPage === (this.pages - 1)) {
        return;
      }

      this.currentPage += 1;
      this.board.soundManager.play('open');
      this.setPage();
    }

    this.prevPage.classList.remove('inactive');
    this.prevPage.onclick = () => {
      if (this.currentPage === 1) {
        return;
      }

      this.currentPage -= 1;
      this.board.soundManager.play('open');
      this.setPage();
    }
  }

  setPage() {
    if (this.pages <= 2) return;

    const pageDiff = -125;
    anime({
      targets: this.list,
      marginLeft: pageDiff * (this.currentPage - 1),
      duration: 300,
      easing: 'easeInSine',
    });

    if (this.currentPage === 1) {
      this.prevPage.classList.add('inactive');
      this.nextPage.classList.remove('inactive');
    }
    else if (this.currentPage === this.pages - 1) {
      this.nextPage.classList.add('inactive');
      this.prevPage.classList.remove('inactive');
    }
    else if (this.currentPage > 1 && this.currentPage < this.pages - 1) {
      this.nextPage.classList.remove('inactive');
      this.prevPage.classList.remove('inactive');
    }
  }
  
  populate() {}

  get totalItems() { return 0; }
  get pages() {
    return Math.ceil(this.totalItems / 5);
  }

  showDescription() {
    this.descriptionWindow = true;
    
    anime({
      targets: this.description,
      opacity: 1,
      height: 80,
      duration: 700,
      complete: () => {
        this.descriptionWindow = false;
      }
    });
  }

  hideDescription() {
    if (this.descriptionWindow) return;
    this.descriptionWindow = true;

    anime({
      targets: this.description,
      opacity: 0,
      height: 0,
      delay: 100,
      duration: 700,
      complete: () => {
        this.descriptionWindow = false;
      }
    });
  }

  selectTarget(source, cb) {
    this.off();
    if (source.type === 'all') {
      this[cb](source, [...this.board.characters, ...this.board.enemies]);
      return this.unselectTarget();
    }
    if (source.type === 'all_foes') {
      this[cb](source, this.board.enemies);
      return this.unselectTarget();
    }
    if (source.type === 'all_allies') {
      this[cb](source, this.board.characters);
      return this.unselectTarget();
    }

    this.board.isMoving = true;
    this.board.hover.enable();
    this.board.hover.set(this.board.findSpotById(this.menu.character.position));
    this.menu.offEffect(() => { });
    this.menu.currentMenu = `${this.MENU_NAME}-select`;

    // distance
    const distance = source?.range || 15;

    [this.availableSpots, this.spotsDistance] = this.board.setAvailableSpots(this.menu.character.position, distance);
    this.targets = this.getTargets(source.type);
    this.board.hover.onMoveCb = (spot, hover) => {
      this.moveTrigger(spot, hover);
    }
    this.board.hover.onClickCb = (spot, hover) => {
      this.clickTrigger(spot, hover, source, cb);
    }
  }

  unselectTarget() {
    this.board.isMoving = false;
    this.board.hover.disable();
    this.menu._actionsOff();
    this.menu.currentMenu = null;
    this.board.clearAvailableSpots();
  }

  offTarget() {
    this.board.isMoving = false;
    this.board.hover.disable();
    this.menu.onEffect();
    this.menu.currentMenu = 'actions';
    this.board.clearAvailableSpots();
  }

  moveTrigger(spot, hover) {
    if (this.availableSpots.includes(spot.id) && this.targets.includes(spot.id)) {
      hover.setStyle('select');
    } else {
      hover.setStyle('block');
    }
  }

  clickTrigger(spot, hover, source, cb) {
    if (this.availableSpots.includes(spot.id) && this.targets.includes(spot.id)) {
      let target = this.board.getCharacter(spot.id) || this.board.getEnemy(spot.id);
      this[cb](source, [target]);
      this.unselectTarget();
    }
  }

  getTargets(type) {
    switch (type) {
      case 'one_foe':
        return this.enemiesPositions;
      case 'one_ally':
        return this.charactersPositions;
      case 'one':
        return [...this.charactersPositions, ...this.enemiesPositions];
      case 'ranged':
        return [...this.charactersPositions, ...this.enemiesPositions];
    }
  }

  get charactersPositions() {
    return this.board.characters.map(c => c.position);
  }

  get enemiesPositions() {
    return this.board.enemies.map(e => e.position);
  }

  _getLine() {
    const line = document.createElement('img');
    line.src = '/images/Battle/MenuLine.png';

    return line;
  }

  get offsetTop() {
    return -40;
  }
}
