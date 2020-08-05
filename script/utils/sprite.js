const { getRenderer } = require('../renderer');

const INFINITE = -1;

class Sprite {
  constructor(name, sheet, width, height, animations) {
    // load the sprite sheet into the image cache
    getRenderer().loadSprite(name, sheet);
    
    // setup
    this.width = width;
    this.height = height;
    this.animations = animations;
    this.animate(Object.keys(animations)[0]); // default to first animation
  }

  animate(stateKey) {
    this.current = stateKey;
    this.frame = 0;
    [, , this.duration] = this.animations[this.current].frames[this.frame] || INFINITE;
  }

  update() {
    if (this.duration === INFINITE) return;

    // decrement the transition counter
    this.duration -= 1;

    if (this.duration === 0) {
      const animation = this.animations[this.current];
      if (this.frame + 1 === animation.frames.length) {
        // if we've reached the end of the animation
        if (animation.next) {
          this.animate(animation.next); // if next = current, the animation will loop
        }
      } else { // just go to the next animation frame
        this.frame += 1;
        // and reset the transition timer
        [, , this.duration] = animation.frames[this.frame] || INFINITE;
      }
    }
  }

  draw(x, y, { mirror = false, width = this.width, height = this.height } = {}) {
    const r = getRenderer();
    if (!r.checkSprite(this.name)) return;

    const animation = this.animations[this.current];
    const [row, col] = animation.frames[this.frame];
    const clipX = row * this.width;
    const clipY = col * this.height;

    r.isolate(() => {
      if (mirror) r.scale(-1, 1);
      r.drawSprite(this.name, clipX, clipY, this.width, this.height, x, y, width, height);
    });
  }
}

module.exports = Sprite;
