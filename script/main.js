

var canvas = document.createElement('canvas');
canvas.width = 1600;
canvas.height = 900;
document.body.appendChild(canvas);

var resizeCanvas = function () {
    var normalRatio = canvas.width / canvas.height;
    var newRatio = window.innerWidth / window.innerHeight;
    var scale = 1;
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

window.addEventListener('keydown', event => {
    let keyCode = event.keyCode;
    switch (keyCode) {
        case 27:
            electronWindow.close();
            break;
        case 121: // F10
        case 122: // F11
            electronWindow.setKiosk(!electronWindow.isKiosk());
            break;
        case 116: // F5
            electronWindow.reload();
            break;
        case 123: // F12
            remote.getCurrentWebContents().openDevTools();
            break;
    }
});

var lastTime = (new Date()).getTime();
var update = function () {
  //------UPDATE------//
  var time = (new Date()).getTime();
  var diff = time - lastTime;
  setTimeout(update, 16);
};

var draw = function (time) {
  //-------DRAW-------//
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  window.requestAnimationFrame(draw);
};

resizeCanvas();
update();
requestAnimationFrame(draw);
