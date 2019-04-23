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

module.exports = Renderer;