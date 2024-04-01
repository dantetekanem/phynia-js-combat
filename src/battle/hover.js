import anime from 'animejs';

export default class Hover {
  constructor(ref, board) {
    this.board = board;
    this.hover = ref;
    this.hover.style.opacity = 0;
    this.style = 'move';
    this.onClickCb = () => {};
    this.onMoveCb = () => {};
  }

  set(spot) {
    if (!spot) return;

    this.board.baseLine = {
      x: spot.x,
      y: spot.y,
    };
    this.move(spot);
  }

  move(spot) {
    if (!this.board.canUseHover) return;

    this.hover.dataset.action = spot.id;
    if (this.onMoveCb) this.onMoveCb(spot, this);
    anime({
      targets: this.hover,
      translateX: spot.x - 7,
      translateY: spot.y - 7,
      easing: 'easeOutQuint',
      duration: 650,
      update: (anim) => {
        this._drawLine(
          this.board.baseLine,
          parseFloat(anim.animations[0].currentValue),
          parseFloat(anim.animations[1].currentValue)
        );
      }
    });
  }

  click(spot) {
    if (!this.board.canUseHover) return;
    if (this.onClickCb) this.onClickCb(spot, this);
  }

  enable() {
    if (!this.board.baseLine) {
      this.board.baseLine = this.board.grid[0][0];
    }

    this.board.canUseHover = true;
    this.board.isMoving = true;
    anime({
      targets: this.hover,
      opacity: 1,
      duration: 560,
      easing: 'linear',
      complete: () => {
        const previousSpot = this.board.findSpotById(this.hover.dataset.action);
        if (this.previousSpot) {
          this._drawLine(this.board.baseLine, previousSpot.x, previousSpot.y);
        }
      }
    });
  }

  disable() {
    this.board.canUseHover = false;
    this.board.isMoving = false;
    anime({
      targets: this.hover,
      opacity: 0,
      duration: 560,
      easing: 'linear',
      complete: (anim) => {
        this._clearCanvas();
      }
    });
    this._clearCanvas();
  }

  toggle() {
    if (this.board.canUseHover) {
      this.disable();
    } else {
      this.enable();
    }
  }

  setStyle(style = 'move') {
    this.style = style;
    const item = this.hover.getElementsByClassName('item')[0];
    item.classList.remove('move');
    item.classList.remove('block');
    item.classList.remove('select');
    item.classList.add(style);
  }

  _drawLine(sourceObj, x, y, lineWidth = 3) {
    let context = this.board.canvas.getContext('2d');
    this._clearCanvas();
    const X = 57 + 110;
    const Y = 60 + 120;

    context.beginPath();
    context.moveTo(sourceObj.x + X, sourceObj.y + Y);
    context.quadraticCurveTo((x + X + sourceObj.x + X) / 2, (y + Y - sourceObj.y + Y) / 2, x + X, y + Y);

    context.lineWidth = lineWidth;
    context.strokeStyle = this.strokeStyle;
    context.shadowBlur = 10;
    context.shadowColor = this.shadowColor;
    context.stroke();
  }

  _clearCanvas() {
    let context = this.board.canvas.getContext('2d');
    context.clearRect(0, 0, this.board.canvas.width, this.board.canvas.height);
  }

  get strokeStyle() {
    switch (this.style) {
      case 'move':
        return '#00a0e9';
      case 'block':
        return '#9c0303';
      case 'select':
        return '#23e900';
      default:
        return '#00a0e9';
    }
  }

  get shadowColor() {
    switch (this.style) {
      case 'move':
        return '#83bbf4';
      case 'block':
        return '#f48383';
      case 'select':
        return '#83f48e';
      default:
        return '#83bbf4';
    }
  }
}
