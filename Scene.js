class Scene {
    constructor(name, data) {
        this.name = name;
        this.data = data;
    }

    static createGame() {
        var data = {
            gObjects: [],
            frame: 0,

            index: 0,

            startTime: Date.now(),
            pausedTime: 0,
            paused: false,

            nextPoints: [],

            prevHoles: [],
            curHoles: [],

            score: 0,
            dScore: 0,
            multiplier: 1,
            timerMax: 15000,
            timerStart: 0,
            resetTimer: true,
            day: 0,
            interim: false,

            hasFailed: false,

            time: 0,
            quota: 5,
            completed: 0,

            toggleTick: false,

            failStitchFrame: -1000,
            failMultiplierFrame: -1000,
            stitchFrame: -1000,
            holeFrame: -1000,
            batchFrame: -1000,

        };

        var startH = 200;
        var startPoints = Create.holes(startH, 0.0);
        var sheet = Create.sheet(rWidth / 2 + 420, rHeight / 2, 800, startH, startH, startPoints[1], []);
        data.gObjects.push(sheet);
        data.nextPoints = startPoints[0];

        data.gObjects.push(Create.pin(rWidth / 2, rHeight * 0.6, true, 0));

        var scene = new Scene("game", data);

        this.addNewSheet(scene, 0.0, 0.0);

        return scene;
    }

    static createMenu() {
        var data = {
            frame: 0,
        }
        return new Scene("menu", data);
    }

    static addNewSheet(scene, dChance, ySpread) {
        var sheets = scene.data.gObjects.filter(o => o.objClass == "Sheet");
        var sheet0 = sheets.find(o => o.data.id == 0)
        var rightH = sheet0.data.leftH;
        var leftH = rightH + (Math.floor(rnd(-2, 2)) * 100);
        leftH = Math.min(600, Math.max(200, leftH));

        if (ySpread < 0.2) {
            leftH = Math.min(300, leftH);
        }

        var newPoints = Create.holes(leftH, dChance);
        var newSheet = Create.sheet(-1200, ((Math.random() - 0.5) * rHeight) * ySpread + rHeight / 2, 800, leftH, rightH, newPoints[1], scene.data.nextPoints);

        sheets.forEach(o => o.data.id += 1);
        scene.data.gObjects.push(newSheet);

        scene.data.nextPoints = newPoints[0];

        newSheet.data.rightHoles.map(o => o.side = "left");
        sheet0.data.leftHoles.map(o => o.side = "right");
        var holes = newSheet.data.rightHoles.concat(sheet0.data.leftHoles);
        holes.sort((a, b) => a.index - b.index);

        scene.data.curHoles = holes;
    }
}