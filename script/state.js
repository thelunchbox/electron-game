class State {
    constructor(args) {
        this.args = args;
        this.frame = 0;
        this.next = null;
        this.renderer = args.renderer;
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
                args: {
                    ...this.nextArgs,
                    renderer: this.renderer,
                },
            }
        }
    }

    draw(renderer) {

    }
}

module.exports = State;