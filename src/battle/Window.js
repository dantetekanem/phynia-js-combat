import anime from 'animejs';

export default class Window {
  HIDE_DELAY = 1000;

  constructor(notifyWindow, fullWindow) {
    this.notify = {
      bg: notifyWindow,
      zone: notifyWindow.getElementsByClassName('middle-zone')[0],
      body: notifyWindow.getElementsByClassName('body')[0],
      text: notifyWindow.getElementsByClassName('text')[0]
    };
    this.full = fullWindow;
  }

  showNotification(text, cb, options = { speedFactor: 1 }, autoHide = true) {
    this.notify.text.innerHTML = text;
    this.notify.bg.style.display = 'block';
    this.notify.bg.style.opacity = 0;
    this.notify.zone.style.width = '0%';
    this.notify.body.style.height = '0%';
    this.notify.text.style.opacity = 0;
    let zone = { pct: 0 };
    let body = { pct: 0 };

    anime({
      targets: this.notify.bg,
      opacity: 1,
      easing: 'linear',
      duration: 300 * options.speedFactor,
      complete: () => {
        anime({
          targets: zone,
          pct: [0, 100],
          duration: 200 * options.speedFactor,
          easing: 'easeOutQuint',
          update: () => {
            this.notify.zone.style.width = `${zone.pct}%`;
          },
          complete: () => {
            anime({
              targets: body,
              pct: [0, 100],
              duration: 250 * options.speedFactor,
              easing: 'easeOutQuint',
              update: () => {
                this.notify.body.style.height = `${body.pct}%`;
              },
              complete: () => {
                anime({
                  targets: this.notify.text,
                  opacity: 1,
                  duration: 400 * options.speedFactor,
                  easing: 'easeOutQuint',
                  complete: () => {
                    if (autoHide) this.hideNotification(cb, options);
                  }
                })
              }
            });
          }
        });
      }
    });
  }

  hideNotification(cb, options = { speedFactor: 1 }) {
    anime({
      delay: this.HIDE_DELAY * options.speedFactor,
      duration: 300 * options.speedFactor,
      easing: 'easeOutQuint',
      targets: this.notify.text,
      opacity: 0,
      complete: () => {
        anime({
          targets: this.notify.body,
          translateY: '100px',
          duration: 400 * options.speedFactor,
          easing: 'easeOutQuint',
          complete: () => {
            anime({
              targets: this.notify.zone,
              translateX: '100%',
              duration: 300 * options.speedFactor,
              easing: 'easeOutQuint',
              complete: () => {
                anime({
                  targets: this.notify.bg,
                  opacity: 0,
                  easing: 'linear',
                  duration: 300 * options.speedFactor,
                  complete: () => {
                    this.restartNotificationSettings();
                    if (cb) cb();
                  }
                })
              }
            })
          }
        })
      }
    })
  }

  restartNotificationSettings() {
    this.notify.bg.style.display = 'none';
    this.notify.bg.style.opacity = 0;
    this.notify.zone.style.transform = '';
    this.notify.body.style.transform = '';
  }
}