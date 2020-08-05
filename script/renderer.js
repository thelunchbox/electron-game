const IMAGE_CACHE = {};

function reconcileArgs(arg1, arg2) {
  if (typeof (arg1) === 'function') {
    return [arg1];
  }
  return [arg2, arg1];
}

class Renderer {
  constructor(root, options = {}) {
    const { width = 1600, height = 900 } = options;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    root.appendChild(canvas);

    const resizeCanvas = function () {
      const normalRatio = canvas.width / canvas.height;
      const newRatio = root.offsetWidth / root.offsetHeight;
      let scale = 1;
      if (newRatio < normalRatio) {
        // tall and skinny
        scale = root.offsetWidth / canvas.width;
      } else if (newRatio >= normalRatio) {
        // short and fat
        scale = root.offsetHeight / canvas.height;
      }
      canvas.style.transform = 'translate(-50%, -50%) scale(' + scale + ', ' + scale + ')';
    }

    window.addEventListener('resize', event => {
      resizeCanvas();
    });

    setTimeout(resizeCanvas, 10);

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.arc = (...args) => this.context.arc(...args);
    this.arcTo = (...args) => this.context.arcTo(...args);
    this.bezierCurveTo = (...args) => this.context.bezierCurveTo(...args);
    this.clearRect = (...args) => this.context.clearRect(...args);
    this.clip = (...args) => this.context.clip(...args);
    this.createImageData = (...args) => this.context.createImageData(...args);
    this.createLinearGradient = (...args) => this.context.createLinearGradient(...args);
    this.createPattern = (...args) => this.context.createPattern(...args);
    this.createRadialGradient = (...args) => this.context.createRadialGradient(...args);
    this.drawFocusIfNeeded = (...args) => this.context.drawFocusIfNeeded(...args);
    this.drawImage = (...args) => this.context.drawImage(...args);
    this.ellipse = (...args) => this.context.ellipse(...args);
    this.fill = (...args) => this.context.fill(...args);
    this.fillRect = (...args) => this.context.fillRect(...args);
    this.fillText = (...args) => this.context.fillText(...args);
    this.getImageData = (...args) => this.context.getImageData(...args);
    this.getLineDash = (...args) => this.context.getLineDash(...args);
    this.getTransform = (...args) => this.context.getTransform(...args);
    this.isPointInPath = (...args) => this.context.isPointInPath(...args);
    this.isPointInStroke = (...args) => this.context.isPointInStroke(...args);
    this.lineTo = (...args) => this.context.lineTo(...args);
    this.measureText = (...args) => this.context.measureText(...args);
    this.moveTo = (...args) => this.context.moveTo(...args);
    this.putImageData = (...args) => this.context.putImageData(...args);
    this.quadraticCurveTo = (...args) => this.context.quadraticCurveTo(...args);
    this.rect = (...args) => this.context.rect(...args);
    this.resetTransform = (...args) => this.context.resetTransform(...args);
    this.rotate = (...args) => this.context.rotate(...args);
    this.scale = (...args) => this.context.scale(...args);
    this.scrollPathIntoView = (...args) => this.context.scrollPathIntoView(...args);
    this.setLineDash = (...args) => this.context.setLineDash(...args);
    this.setTransform = (...args) => this.context.setTransform(...args);
    this.stroke = (...args) => this.context.stroke(...args);
    this.strokeRect = (...args) => this.context.strokeRect(...args);
    this.strokeText = (...args) => this.context.strokeText(...args);
    this.transform = (...args) => this.context.transform(...args);
    this.translate = (...args) => this.context.translate(...args);

    Object.defineProperty(this, 'fillStyle', { get: () => this.context.fillStyle, set: (value) => this.context.fillStyle = value });
    Object.defineProperty(this, 'filter', { get: () => this.context.filter, set: (value) => this.context.filter = value });
    Object.defineProperty(this, 'font', { get: () => this.context.font, set: (value) => this.context.font = value });
    Object.defineProperty(this, 'globalAlpha', { get: () => this.context.globalAlpha, set: (value) => this.context.globalAlpha = value });
    Object.defineProperty(this, 'globalCompositeOperation', { get: () => this.context.globalCompositeOperation, set: (value) => this.context.globalCompositeOperation = value });
    Object.defineProperty(this, 'imageSmoothingEnabled', { get: () => this.context.imageSmoothingEnabled, set: (value) => this.context.imageSmoothingEnabled = value });
    Object.defineProperty(this, 'imageSmoothingQuality', { get: () => this.context.imageSmoothingQuality, set: (value) => this.context.imageSmoothingQuality = value });
    Object.defineProperty(this, 'lineCap', { get: () => this.context.lineCap, set: (value) => this.context.lineCap = value });
    Object.defineProperty(this, 'lineDashOffset', { get: () => this.context.lineDashOffset, set: (value) => this.context.lineDashOffset = value });
    Object.defineProperty(this, 'lineJoin', { get: () => this.context.lineJoin, set: (value) => this.context.lineJoin = value });
    Object.defineProperty(this, 'lineWidth', { get: () => this.context.lineWidth, set: (value) => this.context.lineWidth = value });
    Object.defineProperty(this, 'miterLimit', { get: () => this.context.miterLimit, set: (value) => this.context.miterLimit = value });
    Object.defineProperty(this, 'shadowBlur', { get: () => this.context.shadowBlur, set: (value) => this.context.shadowBlur = value });
    Object.defineProperty(this, 'shadowColor', { get: () => this.context.shadowColor, set: (value) => this.context.shadowColor = value });
    Object.defineProperty(this, 'shadowOffsetX', { get: () => this.context.shadowOffsetX, set: (value) => this.context.shadowOffsetX = value });
    Object.defineProperty(this, 'shadowOffsetY', { get: () => this.context.shadowOffsetY, set: (value) => this.context.shadowOffsetY = value });
    Object.defineProperty(this, 'strokeStyle', { get: () => this.context.strokeStyle, set: (value) => this.context.strokeStyle = value });
    Object.defineProperty(this, 'textAlign', { get: () => this.context.textAlign, set: (value) => this.context.textAlign = value });
    Object.defineProperty(this, 'textBaseline', { get: () => this.context.textBaseline, set: (value) => this.context.textBaseline = value });

    function getFontSize(font) {
      const [size] = font.split(' ');
      return parseInt(size.substr(0, size.length - 2));
    }

    function getFontFamily(font) {
      const [, ...rest] = font.split(' ');
      return rest.join(' ');
    }

    Object.defineProperty(this, 'fontSize', {
      get: () => getFontSize(this.context.font),
      set: (value) => {
        this.context.font = `${value}pt ${getFontFamily(this.context.font)}`;
      },
    });

    Object.defineProperty(this, 'fontFamily', {
      get: () => getFontFamily(this.context.font),
      set: (value) => {
        this.context.font = `${getFontSize(this.context.font)}pt ${value}`;
      },
    });
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  get center() {
    return {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
    };
  }

  reset() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  oscillateText(text, x, y, frame, options = {}) {
    const {
      amplitude = 20,
      period = 1 / 10,
      shift = 0,
      drag = 2,
      outline = true,
      reverse = false,
      padding = 0,
    } = options;
    const size = this.context.measureText(text);
    const textWidth = size.width + (text.length * padding);
    let x0 = x;
    switch (this.textAlign) {
      case 'center':
        x0 = x - textWidth / 2;
        break;
      case 'right':
        x0 = x - textWidth;
        break;
      case 'left':
      default:
        break;
    }
    this.context.save();
    this.context.textAlign = 'left';
    let rendered = '';
    text.split('').forEach((c, i) => {
      const renderedSize = this.context.measureText(rendered);
      const f = reverse ? frame + drag * i : frame - drag * i;
      const offset = i * padding;
      if (outline) this.strokeAndFillText(c, x0 + renderedSize.width + offset, y + (amplitude * Math.sin((f * period) + shift)));
      else this.fillText(c, x0 + renderedSize.width + offset, y + (amplitude * Math.sin((f * period) + shift)));
      rendered += c;
    });
    this.context.restore();
  }

  drawPath(points, close) {
    const [first, ...others] = points;
    this.context.moveTo(first.x, first.y);
    if (close) others.push(first);
    others.forEach(point => {
      if (point.settings) {
        this.context.save();
        this.applySettings(settings);
      }
      this.context.lineTo(point.x, point.y);
      if (point.settings) this.context.restore();
    });
  }

  animatePath(points, frame, options) {
    const { wrap = false, length = points.length, repeat = false } = options;
    const start = Math.round(wrap ? frame % points.length : 0);
    const end = Math.round(wrap ? start + length : repeat ? frame % (length + 1) : Math.min(length, frame));
    if (start == end) return;

    const src = wrap ? [...points, ...points] : [...points];
    const usePoints = src.slice(start, end);
    this.drawPath(usePoints, false);
    this.context.stroke();
  }

  fillPath(points, options) {
    const { close = true } = options;
    this.drawPath(points, close);
    this.context.fill();
  }

  strokePath(points, options) {
    const { close = false } = options;
    this.drawPath(points, close);
    this.context.stroke();
  }

  strokeAndFillPath(points, options) {
    const { close = true } = options;
    this.drawPath(points, close);
    this.context.stroke();
    this.context.fill();
  }

  loadSprite(name, filepath) {
    if (IMAGE_CACHE[name]) return IMAGE_CACHE[name];
    const i = new Image();
    i.src = filepath;
    i.onload = () => {
      IMAGE_CACHE[name] = i;
    }
  }

  checkSprite(name) {
    return Boolean(IMAGE_CACHE[name]);
  }

  clearSprites() {
    IMAGE_CACHE = {};
  }

  drawSprite(name, ...args) {
    if (!IMAGE_CACHE[name]) {
      console.warn(`Could not draw sprite ${name} because it has not been loaded. If you have started the loading process, it may not be complete`);
      return;
    }
    this.context.drawImage(IMAGE_CACHE[name], ...args);
  }

  applySettings(settings) {
    const props = Object.keys(settings);
    props.forEach(prop => {
      this[prop] = settings[prop];
    });
  }

  path(arg1, arg2) {
    const [actions, settings] = reconcileArgs(arg1, arg2);
    this.context.beginPath();
    if (settings) this.applySettings(settings);
    actions();
    this.context.closePath();
  }

  isolate(arg1, arg2) {
    const [actions, settings] = reconcileArgs(arg1, arg2);
    this.context.save();
    if (settings) this.applySettings(settings);
    actions();
    this.context.restore();
  }

  isolatePath(arg1, arg2) {
    const [actions, settings] = reconcileArgs(arg1, arg2);
    this.context.save();
    this.context.beginPath();
    if (settings) this.applySettings(settings);
    actions();
    this.context.closePath();
    this.context.restore();
  }

  strokeAndFillText(text, x, y) {
    this.context.strokeText(text, x, y);
    this.context.fillText(text, x, y);
  }

  drawParagraph(text, x, y, width, stroke = false) {
      const height = this.fontSize * 50 / 36;
      const words = text.split(' ');
      const paragraph = [];
      let line = 0;
      words.forEach(word => {
          if (word == '\n') {
              line ++;
              paragraph[line] = '';
              return;
          }
          const current = paragraph[line];
          const test = current ? current + ' ' + word : word;
          const testWidth = this.context.measureText(test).width;
          if (testWidth <= width) {
              paragraph[line] = test;
          } else {
              line++;
              paragraph[line] = word;
          }
      });
      if (stroke) {
          paragraph.forEach((sentence, i) => {
            this.context.strokeText(sentence.trim(), x, y + i * height);
          });
      }
      paragraph.forEach((sentence, i) => {
        this.context.fillText(sentence.trim(), x, y + i * height);
      });
  }

  fillCircle(x, y, radius) {
    this.arc(x, y, radius, 0, Math.PI * 2);
    this.fill();
  }

  strokeCircle(x, y, radius) {
    this.arc(x, y, radius, 0, Math.PI * 2);
    this.stroke();
  }

  strokeAndFillCircle(x, y, radius) {
    this.arc(x, y, radius, 0, Math.PI * 2);
    this.stroke();
    this.fill();
  }

  strokeAndFillRect(x, y, width, height) {
    this.strokeRect(x, y, width, height);
    this.fillRect(x, y, width, height);
  }
}

let renderer = null;

function createRenderer(root) {
  renderer = new Renderer(root);
  return renderer;
}

module.exports = {
  createRenderer,
  getRenderer: () => renderer
};
