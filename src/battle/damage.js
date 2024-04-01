import anime from 'animejs';

export default class Damage {
  LEFT_OFFSET = 75;
  TOP_OFFSET = 3;
  OUT_DELAY = 300;
  OFFSET_DELAY = 40;
  DURATION = 500;

  constructor (ref) {
    this.ref = ref;
  }

  show(spot, damage, hits = 0, isHeal = false, isCritical = false, effect = '') {
    const dmg = String(damage).split('');
    const div = document.createElement('div');
    div.classList.add('damage');

    let i = 0;
    for (const d of dmg) {
      const dmgBox = document.createElement('div');
      dmgBox.classList.add('option');
      if (isHeal) {
        dmgBox.classList.add('heal');
      }
      dmgBox.style.opacity = 0;
      dmgBox.innerHTML = d;
      if (i === dmg.length - 1) {
        dmgBox.dataset.last = true;
      }
      div.appendChild(dmgBox);

      anime({
        targets: dmgBox,
        translateX: [-25, 10],
        opacity: [0, 1],
        duration: this.DURATION,
        delay: this.OFFSET_DELAY * (dmg.length - i),
        complete: () => {
          anime({
            targets: dmgBox,
            translateX: [10, 35],
            opacity: [1, 0],
            duration: this.DURATION,
            delay: this.OUT_DELAY + (this.OFFSET_DELAY * (dmg.length - i)),
            complete: (e) => {
              if (e.animatables[0].target.dataset?.last === "true") {
                div.remove();
              }
            }
          });
        }
      });
      i++;
    }

    if (hits > 1) {
      const hit = document.createElement('div');
      hit.innerHTML = `HIT +${hits}`;
      hit.classList.add('hit');
      div.appendChild(hit);

      anime({
        targets: hit,
        translateY: [-20, 30],
        opacity: [0, 1],
        duration: this.DURATION,
        complete: () => {
          anime({
            targets: hit,
            translateY: [30, 50],
            opacity: [1, 0],
            duration: this.DURATION * 2,
            delay: this.OUT_DELAY
          });
        }
      });
    }

    if (isCritical) {
      const offsetCritical = hits <= 1 ? -30 : 0;
      const critical = document.createElement('div');
      critical.innerHTML = 'CRITICAL';
      critical.classList.add('critical');
      div.appendChild(critical);

      anime({
        targets: critical,
        translateY: [-20, 30 + offsetCritical],
        opacity: [0, 1],
        duration: this.DURATION,
        complete: () => {
          anime({
            targets: critical,
            translateY: [30 + offsetCritical, 50 + offsetCritical],
            opacity: [1, 0],
            duration: this.DURATION * 2,
            delay: this.OUT_DELAY
          });
        }
      });
    }

    if (effect.length > 0) {
      const effdiv = document.createElement('div');
      effdiv.innerHTML = effect;
      effdiv.classList.add('effect');
      div.appendChild(effdiv);

      anime({
        targets: effdiv,
        translateY: [0, -25],
        opacity: [0, 1],
        duration: this.DURATION,
        complete: () => {
          anime({
            targets: effdiv,
            translateY: [-25, -50],
            opacity: [1, 0],
            duration: this.DURATION * 2,
            delay: this.OUT_DELAY
          });
        }
      });
    }

    div.style.left = `${spot.x + this.LEFT_OFFSET}px`;
    div.style.top = `${spot.y + this.TOP_OFFSET}px`;

    this.ref.appendChild(div);
  }
}
