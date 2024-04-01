import { Howl, Howler } from 'howler';

export default class SoundManager {
  SOUND_MAP = {
    'cancel': '/images/Cancel2.ogg',
    'open': '/images/Cursor2.ogg',
    'swing': '/images/air-swing.wav',
    'cursor': '/images/menu_click.wav',
    'move': '/images/move.ogg',
    'attack_1': '/images/hit.wav',
    'heal': '/images/saber.wav',
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
