import Stats from './Stats';
import * as utils from './utils';

export default class Character extends Stats {
  constructor(attrs) {
    super(attrs);
    this.attackPoints = utils.getRandomInt(-6, 3);
  }

  // methods
  hits(target) {
    let accmod = Math.ceil((target.dodge * 3 - this.accuracy) / 5);

    return {
      weak: utils.clamp(100 - accmod + this.attackPoints, 70, 99),
      strong: utils.clamp(100 - Math.ceil((accmod + 30) / 3) + this.attackPoints, 60, 99),
      fierce: utils.clamp(100 - Math.ceil((accmod + 75) / 3) + this.attackPoints, 50, 99)
    };
  }

  reset() {
    this.ap = this.maxAp;
    this.attackPoints = utils.getRandomInt(-6, 3);
    this.skipTurn = false;
    this.dash.setInfos();
  }
}
