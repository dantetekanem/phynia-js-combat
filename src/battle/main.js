import Timer from './utils/timer';
import Board from './board';
import SoundManager from './SoundManager';
import Character from './Character';
import Enemy from './Enemy';
import weapons from './resources/weapons';
import armors from './resources/armors';
import * as utils from './utils';

class Main {
  constructor() {
   this.timer = new Timer(document.getElementById('timer-text'));
   this.soundManager = new SoundManager();
   this.board = new Board(
     document.getElementById('spots'),
     document.getElementById('mouse-hover'),
     document.getElementById('canvas'),
     this.soundManager,
     document.getElementById('animations')
    );
    this.characters = [];
    this.enemies = [];
  }

  async init() {
    this.timer.start();
    this.board.setup();
    this.characters = this.loadCharacters();
    this.setCharactersToBoard();
    this.enemies = this.loadEnemies();
    this.setEnemiesToBoard();
    await this.board.start();
  }

  loadCharacters() {
    const magics = [
      {
        name: 'All Foes Magic',
        description: '',
        mp: 100,
        type: 'all_foes'
      },
      {
        name: 'One Foe Magic',
        description: '',
        mp: 55,
        type: 'one_foe',
      },
      {
        name: 'Ranged Magic',
        description: '',
        mp: 40,
        type: 'ranged',
        range: 5,
      },
      {
        name: 'All Allies Magic',
        description: '',
        mp: 33,
        type: 'all_allies'
      },
      {
        name: 'One of any',
        description: 'Can hit one of any one',
        mp: 10,
        type: 'one',
      },
      {
        name: 'One Ally Magic',
        description: '',
        mp: 45,
        type: 'one_ally',
      },
      {
        name: 'All In Board Magic',
        description: '',
        mp: 19,
        type: 'all'
      }
    ];

    const items = [];
    for (let i = 0; i < 7; i++) {
      let qty = utils.getRandomInt(1, 5);
      items.push({
        name: `Super Potion - ${i + 1}`,
        qty,
        description: `<b>Super Potion - ${i + 1}</b><br>This is a full description to test the ability of displaying more text inside the user. And we will <b>strongify</b> strings.<br>Quantity: <b>${qty}</b>`,
        type: 'all',
        animation: 'heal',
      });
    }

    const skills = [];
    for (let i = 0; i < 23; i++) {
      skills.push({
        name: `Special Skill - ${i + 1}`,
        description: `<b>Special Skill - ${i + 1}</b><br>This is a full description to test the ability of displaying more text inside the user. And we will <b>strongify</b> strings.`,
        type: 'all',
        animation: 'skill',
      });
    }

    const guts = new Character({
      id: 'guts',
      name: 'Guts The Black Knight',
      avatar: './images/Battle/Avatars/Guts.png',
      position: 'J6',
      maxHp: 214,
      hp: 214,
      maxMp: 50,
      mp: 50,
      maxAp: 7,
      ap: 7,
      gauge: 50,
      effects: [],
      movement: 2,
      attackRange: 20,
      magics,
      items,
      skills,
      str: 14,
      dex: 11,
      res: 13,
      mag: 8,
      level: 4,
      weapon: weapons.sword,
      armor: armors.leather_armor,
    });
    const alma = new Character({
      id: 'alma',
      name: 'Alma Saryannt',
      avatar: './images/Battle/Avatars/hero.jpg',
      position: 'J6',
      maxHp: 214,
      hp: 214,
      maxMp: 50,
      mp: 50,
      maxAp: 7,
      ap: 7,
      gauge: 50,
      effects: [
      ],
      movement: 2,
      attackRange: 5,
      magics,
      items,
      skills,
      str: 14,
      dex: 11,
      res: 9,
      mag: 8,
      level: 4,
      weapon: weapons.sword,
      armor: armors.leather_armor,
    });

    return [guts, alma];
  }

  loadEnemies() {
    const enemies = [
      new Enemy({
        id: 'cave_goblin_a',
        name: 'Cave Goblin A',
        avatar: '/images/Battle/Avatars/Goblin.png',
        position: 'C4',
        maxHp: 200,
        hp: 200,
        maxMp: 20,
        mp: 20,
        ap: 7,
        maxAp: 7,
        gauge: 0,
        effects: [],
        movement: 1,
        attackRange: 1,
        str: 7,
        dex: 8,
        res: 7,
        mag: 3,
        level: 2,
        weapon: weapons.knife,
        armor: {},
      }),
      new Enemy({
        id: 'cave_goblin_b',
        name: 'Cave Goblin B',
        avatar: '/images/Battle/Avatars/Goblin.png',
        position: 'B7',
        maxHp: 200,
        hp: 200,
        maxMp: 20,
        mp: 20,
        ap: 7,
        maxAp: 7,
        gauge: 0,
        effects: [],
        movement: 1,
        attackRange: 1,
        str: 8,
        dex: 6,
        res: 7,
        mag: 3,
        level: 2,
        weapon: {},
        armor: {},
      }),
      new Enemy({
        id: 'cave_goblin_c',
        name: 'Cave Goblin C',
        avatar: '/images/Battle/Avatars/Goblin.png',
        position: 'B7',
        maxHp: 200,
        hp: 200,
        maxMp: 20,
        mp: 20,
        ap: 7,
        maxAp: 7,
        gauge: 0,
        effects: [],
        movement: 1,
        attackRange: 1,
        str: 8,
        dex: 9,
        res: 7,
        mag: 3,
        level: 2,
        weapon: {},
        armor: {},
      }),
      new Enemy({
        id: 'cave_goblin_d',
        name: 'Cave Goblin D',
        avatar: '/images/Battle/Avatars/Goblin.png',
        position: 'B7',
        maxHp: 200,
        hp: 200,
        maxMp: 20,
        mp: 20,
        ap: 7,
        maxAp: 7,
        gauge: 0,
        effects: [],
        movement: 1,
        attackRange: 1,
        str: 8,
        dex: 6,
        res: 7,
        mag: 3,
        level: 2,
        weapon: {},
        armor: {},
      })
    ];

    return enemies;
  }

  setCharactersToBoard() {
    for (const character of this.characters) {
      this.board.setCharacter(character);
    }
  }

  setEnemiesToBoard() {
    for (const enemy of this.enemies) {
      this.board.setEnemy(enemy);
    }
  }
}

window.onload = async function() {
  const main = new Main();
  await main.init();

  window.onkeyup = function(e) {
    if (e.key === "h") {
      main.soundManager.play('cancel');
      main.board.hover.toggle();
    }
    else if(e.key === "Escape") {
      main.board.menu.back();
    }
  }

  // document.addEventListener('contextmenu', function (ev) {
  //   ev.preventDefault();
  //   main.board.menu.back();
  //   return false;
  // }, false);
}