import MenuBase from "./MenuBase";

export default class MenuSkills extends MenuBase {
  MENU_NAME = 'skills';
  AP_POINTS_REQUIRED = 5;

  constructor(menu, board, box, list) {
    super(menu, board, box, list);
  }

  init(parent) {
    const li = document.createElement('li');
    li.innerHTML = 'Special Skills';
    if (this.menu.character.ap >= this.AP_POINTS_REQUIRED) {
      li.onclick = () => {
        this.board.soundManager.play('open');
        this.menu.on('skills');
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
      const skills = this.menu.character.skills.slice(i * 5, (i * 5) + 5);
      const li = document.createElement('li');
      skills.forEach((skill) => {
        const a = document.createElement('a');
        a.innerHTML = skill.name;
        a.href = 'javascript:;';
        li.appendChild(a);

        const span = document.createElement('span');
        span.classList.add('small');
        span.innerHTML = ``;
        a.appendChild(span);
        a.appendChild(this._getLine());

        a.onmouseenter = () => {
          if (this.menu.isAnimationDone) {
            this.board.soundManager.play('cursor');
            this.description.innerHTML = skill.description;
            this.showDescription();
          }
        };
        a.onmouseleave = () => {
          if (this.menu.isAnimationDone) {
            this.hideDescription();
          }
        }
        a.onclick = () => { this.selectTarget(skill, 'invoke') }

      });
      this.list.appendChild(li);
    }
  }

  invoke(skill, targets) {
    console.log(`${this.menu.character.name} is invoking ${skill.name} on ${targets.map(t => t.name).join(', ')}`);
    this.menu.character.useAp(this.AP_POINTS_REQUIRED);
  }

  get totalItems() {
    return this.menu.character.skills.length;
  }

  get offsetTop() {
    return -28;
  }
}
