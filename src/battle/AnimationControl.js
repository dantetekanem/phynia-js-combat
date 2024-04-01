import Spriteling from 'spriteling';

export default class AnimationControl {
  constructor(ref, board) {
    this.ref = ref;
    this.board = board;
    this.animations = [];
    this.setup();
  }

  setup() {
    this.add('simple attack', 'attack.png', 'attack_1', 192, 192, 5, 2, 3);
    this.add('heal', 'item.png', 'heal', 192, 192, 5, 4, 0, 200, { offsetTop: -20, offsetLeft: -5 });
  }

  play(animation, target) {
    const source = this.animations[animation];
    const placeholder = document.createElement('div');
    placeholder.style.width = `${source.width}px`;
    placeholder.style.height = `${source.height}px`;
    placeholder.style.left = `${target.x - 44 + (source?.options?.offsetLeft || 0)}px`;
    placeholder.style.top = `${target.y - 46 + (source?.options?.offsetTop || 0)}px`;
    this.ref.appendChild(placeholder);
    this.ref.style.display = 'block';

    const sprite = new Spriteling({
      url: source.url,
      cols: source.cols,
      rows: source.rows,
      cutOffFrames: source.cutOffFrames,
      delay: source.delay
    }, placeholder);

    this.board.soundManager.play(source.sound);
    sprite.play({
      run: 1,
      onStop: () => {
        this.ref.innerHTML = '';
        this.ref.style.display = 'none';
      }
    })
  }

  add(name, src, sound, width, height, cols, rows, cutOffFrames, delay = 200, options = {}) {
    if (this.animations[name]) {
      throw new Error('The animation already exists');
    }

    this.animations[name] = {
      url: `/images/Animations/${src}`,
      width,
      height,
      cols,
      rows,
      cutOffFrames,
      delay,
      sound,
      options,
    };
  }
}
