const IMAGE_CACHE = {};

class Renderer {
    constructor(root) {
        const canvas = document.createElement('canvas');
        canvas.width = 1600;
        canvas.height = 900;
        root.appendChild(canvas);

        const resizeCanvas = function () {
            const normalRatio = canvas.width / canvas.height;
            const newRatio = window.innerWidth / window.innerHeight;
            let scale = 1;
            if (newRatio < normalRatio) {
                // tall and skinny
                scale = window.innerWidth / canvas.width;
            } else if (newRatio >= normalRatio) {
                // short and fat
                scale = window.innerHeight / canvas.height;
            }
            canvas.style.transform = 'translate(-50%, -50%) scale(' + scale + ', ' + scale + ')';
        }

        window.addEventListener('resize', event => {
            resizeCanvas();
        });

        setTimeout(resizeCanvas, 10);

        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.clearRect = this.context.clearRect;
        this.clip = this.context.clip;
        this.createImageData = this.context.createImageData;
        this.createLinearGradient = this.context.createLinearGradient;
        this.createPattern = this.context.createPattern;
        this.createRadialGradient = this.context.createRadialGradient;
        this.drawFocusIfNeeded = this.context.drawFocusIfNeeded;
        this.drawImage = this.context.drawImage;
        this.ellipse = this.context.ellipse;
        this.fill = this.context.fill;
        this.fillRect = this.context.fillRect;
        this.fillText = this.context.fillText;
        this.getImageData = this.context.getImageData;
        this.getLineDash = this.context.getLineDash;
        this.getTransform = this.context.getTransform;
        this.isPointInPath = this.context.isPointInPath;
        this.isPointInStroke = this.context.isPointInStroke;
        this.lineTo = this.context.lineTo;
        this.measureText = this.context.measureText;
        this.moveTo = this.context.moveTo;
        this.putImageData = this.context.putImageData;
        this.quadraticCurveTo = this.context.quadraticCurveTo;
        this.rect = this.context.rect;
        this.resetTransform = this.context.resetTransform;
        this.rotate = this.context.rotate;
        this.scale = this.context.scale;
        this.scrollPathIntoView = this.context.scrollPathIntoView;
        this.setLineDash = this.context.setLineDash;
        this.setTransform = this.context.setTransform;
        this.stroke = this.context.stroke;
        this.strokeRect = this.context.strokeRect;
        this.strokeText = this.context.strokeText;
        this.transform = this.context.transform;
        this.translate = this.context.translate;

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
        // use measureText to find out how big each letter is
        // figure out if we're left|center|right justified
        // figure out if we're top|middle|bottom baseline
    }

    loadSprite(name, filepath) {
        if (IMAGE_CACHE[name]) return IMAGE_CACHE[name];
        const i = new Image();
        i.src = filepath;
        i.onload = () => {
            IMAGE_CACHE[name] = i;
        }
    }

    drawSprite(name, x, y, w, h, dx, dy, dw, dh) {
        if (!IMAGE_CACHE[name]) {
            console.warn(`Could not draw sprite ${name} because it has not been loaded. If you have started the loading process, it may not be complete`);
            return;
        }
        this.drawImage(IMAGE_CACHE[name], x, y, w, h, dx, dy, dw, dh);
    }

    applySettings(settings) {
        const props = Object.keys(settings);
        props.forEach(prop => {
            this[prop] = settings[prop];
        });
    }

    path(actions, settings) {
        this.context.beginPath();
        if (settings) this.applySettings(settings);
        actions();
        this.context.closePath();
    }

    isolate(actions, settings) {
        this.context.save();
        if (settings) this.applySettings(settings);
        actions();
        this.context.restore();
    }

    isolatePath(actions, settings) {
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
}

module.exports = Renderer;