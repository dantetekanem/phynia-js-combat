import { Howl, Howler } from 'howler';

export default class SoundManager {
  SOUND_MAP = {
    'cancel': '/sounds/Cancel2.ogg',
    'open': '/sounds/Cursor2.ogg',
    'swing': '/sounds/air-swing.wav',
    'cursor': '/sounds/menu_click.wav',
    'move': '/sounds/move.ogg',
    'attack_1': '/sounds/hit.wav',
    'heal': '/sounds/saber.wav',
    'victory': '/sounds/victory.wav',
  };
  VOLUME = 0.5;

  constructor() {
    this.soundIsOn = true;
  }

  play(sound) {
    if (this.soundIsOn) {
      new Howl({
        src: [this.SOUND_MAP[sound]],
        volume: this.VOLUME,
      }).play();
    }
  }
}
