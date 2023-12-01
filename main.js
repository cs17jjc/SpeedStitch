//Configure canvas sizes
var displayCanvas = document.getElementById("canvas");
resizeDisplay();
var displayContext = displayCanvas.getContext("2d");
displayContext.imageSmoothingEnabled = false;
displayContext.webkitImageSmoothingEnabled = false;

var renderCanvas = document.createElement("canvas");
renderCanvas.width = 1920;
renderCanvas.height = 1080;
var ctx = renderCanvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;

var rWidth = renderCanvas.width;
var rHeight = renderCanvas.height;

//add mouse event handlers
var isMouseDown = false;
var prevMouseDown = false;
var mPos = { x: 0, y: 0 };
var boundingRect = displayCanvas.getBoundingClientRect();
document.addEventListener('mousedown', (e) => {
    isMouseDown = true;
});
document.addEventListener('mouseup', (e) => {
    isMouseDown = false;
});

document.addEventListener('mousemove', (e) => {
    var x = (e.clientX - boundingRect.left) / (boundingRect.right - boundingRect.left);
    var y = (e.clientY - boundingRect.top) / (boundingRect.bottom - boundingRect.top);
    if (x > 0 && x < boundingRect.width && y > 0 && y < boundingRect.height) {
        mPos = { x, y };
    }
});

//add keyboard inputs
var keys = Input.new();
keys.attachInput("L", 'a');
keys.attachInput("R", 's');
keys.attachInput("debug", '.');
keys.attachInput("pause", 'Escape');
document.addEventListener('keydown', (e) => {
    keys.update(e.key, true);
});
document.addEventListener('keyup', (e) => {
    keys.update(e.key, false);
});

//Load textures
var textures = new Map();
var spritesheets = new Map();
var patterns = new Map();


//Add sounds
var sound = Sound.new();
sound.defineSounds();

var scene = Scene.createMenu();
var playing = false;

function onNextFrame() {

    UpdateScene.update(scene);
    RenderScene.render(scene, ctx);

    displayContext.drawImage(renderCanvas, 0, 0, displayCanvas.width, displayCanvas.height);

    keys.updateKeyStates();
    prevMouseDown = isMouseDown;
}

//Add music

var mySongData = zzfxM(...song);
var myAudioNode = zzfxP(...mySongData);
myAudioNode.loop = true;
var music = true;


//Wait for image to load before running update loop
var loadedImages = false;
var loadChecker;
loadChecker = setInterval(() => {

    if (loadedImages) {
        Array.from(document.images).forEach(i => {
            if (i.src.includes("Sheets")) {
                var texSheet = new TextureSheet(i, 16);
                switch (i.id) {
                    default: break;
                }
                spritesheets.set(i.id, texSheet);
            } else if (i.src.includes("Pattern")) {
                var pattern;
                switch (i.id) {
                    default: pattern = ctx.createPattern(i, "repeat");
                    break;
                }
                patterns.set(i.id, pattern);
            } else {

                if (i.id == "bg") {
                    var tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = i.width;
                    tmpCanvas.height = i.height;
                    var tmpCtx = tmpCanvas.getContext("2d");
                    tmpCtx.filter = "blur(5px)";
                    tmpCtx.drawImage(i, 0, 0);
                    textures.set(i.id + "B", tmpCanvas);
                }

                textures.set(i.id, i);
            }
        });

        onGame();
        setTimeout(() => { myAudioNode.start(); }, 2000);
        clearInterval(loadChecker);
        setInterval(() => onNextFrame(), 50);

    } else {
        loadedImages = true;
        Array.from(textures.keys()).forEach(i => {
            if (!textures.get(i).complete) {
                loadedImages = false;
            }
        })
    }

}, 50);

var disableTransition = false;

function resizeDisplay() {
    var parent = document.getElementById("canvas-container");
    displayCanvas.width = parent.offsetWidth;
    displayCanvas.height = parent.offsetHeight;
    boundingRect = displayCanvas.getBoundingClientRect();

    document.body.classList.add("stop-transitions");
    if (!disableTransition) {
        disableTransition = true;
        setTimeout(() => {
            document.body.classList.remove("stop-transitions");
            disableTransition = false;
        }, 200);
    }
}

function toggleSound() {
    sound.isActive = !sound.isActive;
    if (!sound.isActive) {
        document.getElementById("sound").classList.add("active");
    } else {
        document.getElementById("sound").classList.remove("active");
    }
}

function toggleMusic() {
    if (music) {
        music = false;
        myAudioNode.disconnect();
        document.getElementById("music").classList.add("active");
    } else {
        music = true;
        var g = zzfxX.createGain();
        g.gain.setValueAtTime(-0.95, zzfxX.currentTime);
        g.connect(zzfxX.destination);
        myAudioNode.connect(g);
        myAudioNode.connect(zzfxX.destination);
        document.getElementById("music").classList.remove("active");
    }
}

(function() {
    var script = document.createElement('script');
    script.onload = function() {
        var stats = new Stats();
        document.body.appendChild(stats.dom);
        requestAnimationFrame(function loop() {
            stats.update();
            requestAnimationFrame(loop)
        });
    };
    script.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
    document.head.appendChild(script);
})

function onPause() {
    if (!scene.data.paused) {
        scene.data.paused = true;
        scene.data.pausedTime = Date.now();
        document.getElementById("cover").classList.remove("fade-out");
        document.getElementById("cover").classList.remove("fade-partial-out");
        document.getElementById("cover").classList.add("fade-partial-in");
        document.getElementById("restart-btn").classList.add("in");
        document.getElementById("restart-btn").classList.remove("out");
        document.getElementById("paused").classList.add("in");
        document.getElementById("paused").classList.remove("out");
    } else {
        scene.data.paused = false;
        scene.data.startTime += (Date.now() - scene.data.pausedTime);
        document.getElementById("cover").classList.add("fade-partial-out");
        document.getElementById("cover").classList.remove("fade-partial-in");
        document.getElementById("restart-btn").classList.remove("in");
        document.getElementById("restart-btn").classList.add("out");
        document.getElementById("paused").classList.remove("in");
        document.getElementById("paused").classList.add("out");
    }
}

var onGameBool = false;

function onResBtn() {
    sound.playSound("UI");
    onGame();
}

function onGame() {
    if (!onGameBool) {
        document.getElementById("cover").classList.add("fade-in");
        document.getElementById("cover").classList.remove("fade-out");
        document.getElementById("cover").classList.remove("fade-partial-in");
        document.getElementById("restart-btn").classList.remove("in");
        document.getElementById("restart-btn").classList.add("out");
        document.getElementById("highscore").classList.remove("in");
        document.getElementById("highscore").classList.add("out");
        document.getElementById("paused").classList.remove("in");
        document.getElementById("paused").classList.add("out");
        onGameBool = true;
        setTimeout(() => {
            document.getElementById("coverFront").classList.add("hide");
            document.getElementById("cover").classList.add("fade-out");
            document.getElementById("cover").classList.remove("fade-in");
            scene = Scene.createGame();
            onGameBool = false;
        }, 2000);
    }
}

const multArr = ["ffbe0b", "fb5607", "ff006e", "8338ec", "3a86ff"].reverse();