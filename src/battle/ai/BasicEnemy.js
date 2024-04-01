import AIPlanner from "./AIPlanner";
import States from "./States";
import ActionCosts from "./ActionCosts";
import CombatControl from "../CombatControl";
import * as utils from '../utils';

export default class BasicEnemy {
  WAIT_ACTION_TIME = 200;

  constructor(enemy, board) {
    this.enemy = enemy;
    this.board = board;
    this.state = States.Idle;
    this.hits = 1;
    this.targetables = ['characters'];
    this.combat = new CombatControl;
  }

  // Perform AI (not using GOAP right now)
  async perform() {
    let isPerforming = true;
    while (isPerforming) {
      if (this.canAttack()) {
        await this.attack();
      } else if (this.canMove()) {
        await this.move();
      } else {
        console.log('END TURN');
        isPerforming = false;
      }
      //
      await utils.wait(this.WAIT_ACTION_TIME);
    }
  }

  // Actions

  async move() {
    console.log('MOVE');
    this.state = States.Moving;
    this.enemy.ap -= ActionCosts.Move;
    let path = this.getPathToClosestTarget();
    this.board.setAvailableSpots(this.enemy.position, this.enemy.movement);
    await utils.wait(500);
    await this.board.movePiece(this.enemy.position, path[this.enemy.movement - 1].id);
    await utils.wait(300);
    this.board.clearAvailableSpots();
  }

  async attack() {
    let target = utils.getRandomInRange(this.targetsInRange());
    console.log(`${this.enemy.name}[${this.enemy.position}] will attack ${target.name}[${target.position}]`);
    //
    let hit = {
      type: 'strong',
      pct: utils.getRandomInt(75, 95),
      atkPoints: 1
    };
    this.state = States.Attack;
    this.enemy.ap -= ActionCosts.Attack;
    this.board.setAvailableSpots(this.enemy.position, this.enemy.movement);
    await utils.wait(500);

    if (!this.combat.damage(hit, this.board, this.enemy, target, this.hits)) {
      await utils.wait(300);
      this.board.clearAvailableSpots();
      return;
    }

    this.hits += 1;
    if (target.isDead) {
      this.board.kill(target.id);
    }
    await utils.wait(300);
    this.board.clearAvailableSpots();
  }

  skill() { }

  magic() { }

  escape() { }

  heal() { }

  modifyBoard() { }

  invoke() { }

  specialTechnique() { }

  designTrap() { }

  powerUp() { }

  statusEffect() { }

  // Helpers

  anyTargetInRange() {
    return this.targetsInRange().length > 0;
  }

  targetsInRange() {
    let targets = [];
    let [range, _rangeDistance, _markedPositions] = this.board.getAvailableSpotsInRange(
      this.enemy.position,
      this.enemy.attackRange
    );

    for (const targetGroup of this.targetables) {
      for (const target of this.board[targetGroup]) {
        if (target.id !== this.enemy.id && range.includes(target.position)) {
          targets.push(target);
        }
      }
    }

    return targets;
  }
  
  getPathToClosestTarget() {
    let targets = [], target;
    for (const targetGroup of this.targetables) {
      this.board[targetGroup].map(t => {
        if (t.id === this.enemy.id) return;
        targets.push(this.board.findSpotById(t.position));
      });
    }

    return this.board.pathToClosest(this.board.findSpotById(this.enemy.position), targets);
  }
  
  // Questions

  canMove() {
    return this.enemy.ap >= ActionCosts.Move; // always move as last option
  }
  shouldMove() {
    return true;
  }

  canAttack() {
    return this.enemy.ap >= ActionCosts.Attack && this.anyTargetInRange();
  }
  shouldAttack() {
    return true; // Here will be implemented costs and logic for action
  }

  canSkill() { }
  shouldSkill() { }

  canMagic() { }
  shouldMagic() { }

  canEscape() { }
  shouldEscape() { }

  canHeal() { }
  shouldHeal() { }

  canModifyBoard() { }
  shouldModifyBoard() { }

  canInvoke() { }
  shouldInvoke() { }

  canSpecialTechnique() { }
  shouldSpecialTechnique() { }

  canDesignTrap() { }
  shouldDesignTrap() { }

  canPowerUp() { }
  shouldPowerUp() { }

  canStatusEffect() { }
  shouldStatusEffect() { }

  // Getters

  get worldState() {
    return {
      enemies: this.board.enemies,
      characters: this.board.characters,
      self: this,
      selfRef: this.enemy,
    };
  }

  get actions() {
    return {};
  }

  get goals() {
    return {};
  }

  get currentPlan() {
    return AIPlanner(this.worldState, this.actions, this.goals);
  }
}