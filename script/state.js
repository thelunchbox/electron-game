class State {
  constructor(args) {
    this.args = args;
    this.next = null;
    this.frame = 0;
  }

  update(dt, keys) {
    if (this.frame == Number.MAX_SAFE_INTEGER) {
      this.frame = 0;
    } else {
      this.frame += 1;
    }
    if (this.next) {
      return {
        next: this.next,
        args: this.nextArgs,
      }
    }
  }

  draw() {

  }
}

module.exports = State;