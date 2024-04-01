import * as utils from './utils';

export default class Stats {
  MIN_RANGE = 1.0;
  MAX_RANGE = 1.25;

  constructor(attrs) {
    for (const key of Object.keys(attrs)) {
      this[key] = attrs[key];
    }

    this.skipTurn = false;
  }

  useAp(amount) {
    this.ap -= amount;
    if (this.ap <= 0) {
      this.ap = 0;
    }
    this.dash.setInfos();
  }

  damage(target, mod) {
    switch (this.weapon?.type) {
      case 'sword':
        return this.swordDamage(target, mod);
      default:
        return this.unarmedDamage(target, mod);
    }
  }

  unarmedDamage(target, mod = 1) {
    return Math.round((11 * utils.getRandom(this.MIN_RANGE, this.MAX_RANGE) - target.defense) * (this.str * (this.level + this.str) / 256) * mod);
  }

  // Swords (1H & 2H), Spears, Crossbows, Rods
  swordDamage(target, mod = 1) {
    return Math.round(
      (this.attack * utils.getRandom(this.MIN_RANGE, this.MAX_RANGE) - target.defense) * 
      (1 + this.str * ((this.level + this.str) / 512))
      * mod);
  }

  /* DAMAGES
    POLES
    DMG = [ATK x RANDOM(1~1.125) - MDEF] x [1 + STR x (Lv+STR)/256]

    Maces
    DMG = [ATK x RANDOM(1~1.125) - DEF] x [1 + MAG x (Lv+MAG)/256]

    Katanas, Staves
    DMG = [ATK x RANDOM(1~1.125) - DEF] x [1 + STR x (Lv+MAG)/256] 

    Axes, Hammers, Handbombs
    DMG = [ATK x RANDOM(0~1.111) - DEF] x [1 + STR x (Lv+VIT)/128]

    Daggers, Ninja Swords, Bows
    DMG = [ATK x RANDOM(1~1.125)]- DEF] x [1 + STR x (Lv+SPD)/218]

    Magic Damage
    DMG = [POW x RANDOM(1~1.125) - MDEF] x [2 + MAG x (Lv+MAG)/256)]  

    Magic Healing
    HEAL = POW x RANDOM(1~1.125) x [2 + MAG x (Lv+MAG)/256)] 
  */

  modifyByEffects(parameter, value) {
    return value;
  }

  checkStatus() {
    this.hp = utils.clamp(this.hp, 0, this.maxHp);
    this.mp = utils.clamp(this.mp, 0, this.maxMp);
    this.ap = utils.clamp(this.ap, 0, this.maxAp);
    this.gauge = utils.clamp(this.gauge, 0, 100);
  }

  get attack() {
    let atk = this.str + (this.weapon?.attack || 0);

    return this.modifyByEffects('attack', atk);
  }

  get defense() {
    return this.res + (this.armor?.defense || 0);
  }

  get accuracy() {
    return Math.ceil((this.dex * 5 + (this.weapon?.accuracy || 0)) / 3);
  }

  get dodge() {
    return Math.ceil(((this.str + this.dex * 5) / 2) - this.equipLoad);
  }

  get critical() {
    return 5;
  }

  get equipLoad() {
    return this.weapon?.weight || 0 +
      this.armor?.weight || 0 +
      this.accessory_1?.weight || 0 +
      this.accessory_2?.weight || 0;
  }

  get canAttack() {
    return true; // can always attack
  }

  get canMove() {
    return true; // modify with status effects (stoned, sleeping, delay)
  }

  get hpPct() {
    return Math.round(this.hp / this.maxHp * 100);
  }

  get mpPct() {
    return Math.round(this.mp / this.maxMp * 100);
  }

  get isDead() {
    return this.hp <= 0;
  }
}
