import * as utils from './utils';

export default class CombatControl {
  WEAK_MOD = 0.5;
  STRONG_MOD = 1.5;
  FIERCE_MOD = 2.3;

  constructor() { }

  damage(hit, board, from, target, hitCount) {
    let targetSpot = board.findSpotById(target.position);

    if (utils.getRandomInt(1, 100) > hit.pct) {
      board.soundManager.play('swing');
      from.dash.setInfos();
      board.damage.show(targetSpot, 'MISS');
      return false;
    }

    let critical = false, damage;
    if (hit.type === 'weak') {
      damage = from.damage(target, this.WEAK_MOD);
    } else if (hit.type === 'strong') {
      damage = from.damage(target, this.STRONG_MOD);
    } else if (hit.type === 'fierce') {
      damage = from.damage(target, this.FIERCE_MOD);
    }
    // add hit incremental (0.05x for every hit)
    damage += Math.round(damage * (1 + (0.1 * hitCount)));

    if (utils.getRandomInt(1, 100) <= from.critical) {
      damage *= 2;
      critical = true;
    }

    from.attackPoints += hit.atkPoints;
    board.damage.show(targetSpot, damage, hitCount, false, critical);
    board.shake(critical ? 0.5 : 0.3, critical ? 10 : 5);
    target.dash.updateHP(target.hp - damage);
    target.hp -= damage;
    target.checkStatus();
    from.checkStatus();
    board.animator.play('simple attack', targetSpot);

    return true;
  }
};
