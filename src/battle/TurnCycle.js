import * as utils from './utils';
import BasicEnemy from './ai/BasicEnemy';

export default class TurnCycle {
  constructor(board) {
    this.board = board;
    this.characters = board.characters;
    this.enemies = board.enemies;
    this.currentTurn = 'characters';
    this.whosTurn = document.getElementById('whos-turn');
  }

  start() {
    this.board.window.showNotification('Fight will start!', () => {
      if ( utils.getRandomInt(1, 100) > 35) {
        this.setTurn('characters', false);
      } else {
        this.setTurn('enemies');
      }
    });
  }

  checkTurnsEnd() {
    const ended = this[this.currentTurn].filter(c => c.ap === 0).length === this[this.currentTurn].length;

    if (ended) {
      // end turn
      utils.wait(800).then(() => {
        this.setTurn(this.currentTurn === 'characters' ? 'enemies' : 'characters');
      });
    }
  }

  removeAnyActiveDashboard() {
    for (const c of this.board.characters) {
      c.dash.inactive();
    }
    for (const e of this.board.enemies) {
      e.dash.inactive();
    }
  }

  setTurn(who, notify = true) {
    this.enemies = this.board.enemies;
    this.characters = this.board.characters;
    //
    if (this.enemies.every(e => e.isDead)) {
      console.log('All enemies are dead!');
      return;
    }
    if (this.characters.every(e => e.isDead)) {
      console.log('All allies are dead!');
      return;
    }

    this.currentTurn = who;
    if (who === 'characters') {
      this.whosTurn.innerHTML = 'Your Turn';
      this.characters.forEach(c => {
        c.reset();
        if (notify) {
          this.board.window.showNotification('Your Turn!', null, { speedFactor: 0.4 });
        }
      });
    } else {
      this.whosTurn.innerHTML = 'Enemy Turn';
      this.runEnemyAI();
    }
  }

  async runEnemyAI() {
    this.board.window.showNotification('Enemy turn!', async () => {
      await utils.wait(500);
      for (const enemy of this.enemies) {
        const ai = new BasicEnemy(enemy, this.board);
        enemy.dash.active();
        await utils.wait(350);
        await ai.perform();
        enemy.dash.inactive();
        enemy.ap = enemy.maxAp;
        enemy.dash.setInfos();
      }

      await utils.wait(500);
      this.setTurn('characters');
    }, { speedFactor: 0.4 });
  }
}
