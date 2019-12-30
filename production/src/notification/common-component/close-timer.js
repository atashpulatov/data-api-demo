export class CloseTimer {
    start = (duration, callback) => {
      if (duration) {
        this.timer = setTimeout(() => {
          callback();
        }, duration * 1000);
      }
    }

    clear = () => {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }

    restart(duration) {
      this.clear();
      this.start(duration);
    }
}
