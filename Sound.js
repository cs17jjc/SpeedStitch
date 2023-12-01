class Sound {
    constructor(soundMap) {
        this.soundMap = soundMap;
        this.isActive = true;
    }
    static new() {
        return new Sound(new Map());
    }
    addSound(name, soundArr) {
        this.soundMap.set(name, soundArr);
    }
    playSound(name) {
        var soundArr = this.soundMap.get(name);
        if (soundArr != null && this.isActive) {
            zzfx(...soundArr).start();
        }
    }
    defineSounds() {
        this.addSound('ding1', [, .1, 1626, , .04, .25, 1, .68, , , 100, .05, , , , , , .9, .09]);
        this.addSound('stitch', [1.13, , 210, .02, .03, .01, 4, 2.89, , 80, -14, .01, , , 2.1, .1, , .2]);
        this.addSound('tik', [1.03, 0, 800, , , .01, 4, .97, , -8.3, 32, .21, , , 145, , , , , .27]);
        this.addSound('tok', [1.03, 0, 1800, , , .01, 4, .97, , -8.3, 32, .21, , , 145, , , , , .27]);
        this.addSound('failStitch', [1.19, , 420, , , .08, 4, 1.55, , , , , , .7, , .4, , .54, .03, .09]);
        this.addSound('failMultiplier', [1.02, , 334, , .04, .39, 4, 1.66, , .9, , , , 1, , .6, , .74, .03]);
        this.addSound('fail', [1.18, , 402, .09, .01, .18, 4, .05, -0.4, -7.2, , , , , 100, .8, .07, , .15]);
        this.addSound('UI', [1.99, , 617, .04, , .02, 1, 1.52, , , -250, .04, .14, , , , .05]);
    }
}