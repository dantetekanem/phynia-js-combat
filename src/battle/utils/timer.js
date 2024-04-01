export default class Timer {
  constructor(ref, time = 0) {
    this.ref = ref;
    this.time = time;
  }

  start() {
    setInterval(() => {
      this.time += 1;
      this.render();
    }, 1000);
  }

  render() {
    const seconds = this.time % 60;
    const minutes = ~~((this.time % 3600) / 60);
    this.ref.innerHTML = `${this.withPreZero(minutes)}:${this.withPreZero(seconds)}`;
  }

  withPreZero(time) {
    return time < 10 ? `0${time}` : time;
  }
}