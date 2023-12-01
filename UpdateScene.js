class UpdateScene {

    static update(scene) {
        switch (scene.name) {
            case 'game':
                if (!scene.data.paused) {
                    UpdateScene.updateGame(scene);
                }
                if (keys.cKs.includes("pause") && !keys.pKs.includes("pause")) {
                    onPause();
                }
                break;
            case 'menu':
                UpdateScene.updateMenu(scene);
                break;
        }
    }

    static updateGame(scene) {

        if (!scene.data.hasFailed) {
            var hole = scene.data.curHoles[scene.data.index];
            var side = hole.side;
            hole.hit = false;
            if (keys.cKs.includes("debug") && !keys.pKs.includes("debug")) {
                console.log(scene.data.stitches);
            }
            var wrongHit = false;
            var rightHit = false;
            if (keys.cKs.includes("L") && !keys.pKs.includes("L")) {
                if (side == "left") {
                    if (!hole.double) {
                        rightHit = true;
                    } else if (keys.cKs.includes("R")) {
                        rightHit = true;
                    } else {
                        wrongHit = true;
                    }
                } else {
                    if (!hole.double) {
                        wrongHit = true;
                    }
                }
            }
            if (keys.cKs.includes("R") && !keys.pKs.includes("R")) {
                if (side == "right") {
                    if (!hole.double) {
                        rightHit = true;
                    } else if (keys.cKs.includes("L")) {
                        rightHit = true;
                    } else {
                        wrongHit = true;
                    }
                } else {
                    if (!hole.double) {
                        wrongHit = true;
                    }
                }
            }


            if (rightHit) {
                hole.hit = true;
                scene.data.index += 1;
                sound.playSound("stitch");
                scene.data.holeFrame = scene.data.frame;
                if (!playing) {
                    scene.data.timerStart = Date.now() - scene.data.startTime;
                }
                playing = true;
            }
            if (wrongHit) {
                if (scene.data.multiplier > 1 && scene.data.index > 0) {
                    sound.playSound("failMultiplier");
                    scene.data.failMultiplierFrame = scene.data.frame;

                } else {
                    sound.playSound("failStitch");
                }
                if (scene.data.index > 0) {
                    scene.data.multiplier = 1;
                }
                scene.data.failStitchFrame = scene.data.frame;
                scene.data.index -= 1;
            }

            scene.data.index = Math.max(0, scene.data.index);

            if (scene.data.index == scene.data.curHoles.length) {
                scene.data.prevHoles.push(scene.data.curHoles);
                var addScore = scene.data.curHoles.length * scene.data.multiplier;
                scene.data.score += addScore;

                scene.data.gObjects.push(Create.scorePoint(rWidth / 2, hole.y - rHeight * 0.05, addScore, scene.data.frame, 20));

                var yVary = Math.min(1, scene.data.day / 10);
                Scene.addNewSheet(scene, 0.5, yVary);
                scene.data.index = 0;
                scene.data.resetTimer = true;
                scene.data.multiplier += 1;

                scene.data.completed += 1;
                sound.playSound("ding1");

                scene.data.stitchFrame = scene.data.frame;
            }

            if (scene.data.completed >= scene.data.quota) {
                scene.data.completed = 0;
                scene.data.quota += 1;
                scene.data.timerMax = Math.max(1000, scene.data.timerMax - 1000);
                scene.data.day += 1;
                scene.data.batchFrame = scene.data.frame;
            }

            scene.data.gObjects.forEach(o => {
                switch (o.objClass) {
                    case "Sheet":
                        if (o.data.id == 0) {
                            o.pos.x = lerp(o.pos.x, rWidth / 2 - 420, 0.1);
                            o.pos.y = lerp(o.pos.y, rHeight / 2, 0.1);
                        } else if (o.data.id == 1) {
                            o.pos.x = lerp(o.pos.x, rWidth / 2 + 420, 0.1);
                            o.pos.y = lerp(o.pos.y, rHeight / 2, 0.1);
                        } else if (o.data.id == 2) {
                            o.pos.x = lerp(o.pos.x, rWidth / 2 + 1220, 0.1);
                            o.pos.y = lerp(o.pos.y, rHeight / 2, 0.1);
                        } else if (o.data.id == 3) {
                            o.pos.x = lerp(o.pos.x, rWidth / 2 + 2020, 0.1);
                            o.pos.y = lerp(o.pos.y, rHeight / 2, 0.1);
                        } else {
                            o.alive = false;
                        }

                        o.data.leftHoles.forEach(h => {
                            h.x = o.pos.x - o.data.width / 2 + 20;
                            h.y = o.pos.y + h.yOff - o.data.leftH / 2 + 25;
                        });
                        o.data.rightHoles.forEach(h => {
                            h.x = o.pos.x + o.data.width / 2 - 20;
                            h.y = o.pos.y + h.yOff - o.data.rightH / 2 + 25;
                        });
                        break;
                    case "ScorePoint":
                        o.pos.x += o.vel.x;
                        o.pos.y += o.vel.y;
                        if (scene.data.frame - o.data.frameMade >= o.data.lifetime) {
                            o.alive = false;
                        }
                        break;
                    case "Pin":
                        if (o.data.follow) {
                            var followHole = scene.data.curHoles[scene.data.index - 1];
                            if (followHole) {
                                o.pos.x = lerp(o.pos.x, followHole.x, 0.4);
                                o.pos.y = lerp(o.pos.y, followHole.y, 0.4);
                            } else {
                                o.pos.x = lerp(o.pos.x, rWidth * 0.6, 0.4);
                                o.pos.y = lerp(o.pos.y, rHeight * 0.8, 0.4);
                            }
                        }
                }
            });

            scene.data.time = Date.now() - scene.data.startTime;
            var timeCompleted = (scene.data.time - scene.data.timerStart) / scene.data.timerMax;
            timeCompleted = Math.min(1, timeCompleted);
            if (playing) {
                if (timeCompleted >= 1) {
                    scene.data.hasFailed = true;
                    document.getElementById("cover").classList.remove("fade-partial-out");
                    document.getElementById("cover").classList.remove("fade-out");
                    document.getElementById("cover").classList.add("fade-partial-in");
                    document.getElementById("restart-btn").classList.add("in");
                    document.getElementById("restart-btn").classList.remove("out");

                    document.getElementById("highscore").classList.add("in");
                    document.getElementById("highscore").classList.remove("out");


                    var pb = localStorage.getItem("EndlessScarfHighsocre");
                    if (pb == null || pb < scene.data.score) {
                        localStorage.setItem("EndlessScarfHighsocre", scene.data.score);
                    }
                    pb = localStorage.getItem("EndlessScarfHighsocre");
                    document.getElementById("highscore-value").innerHTML = pb;

                    sound.playSound("fail");

                } else if (timeCompleted >= 0.75) {
                    var t = scene.data.frame / 3;
                    if (t % 2 == 0 && !scene.data.toggleTick) {
                        scene.data.toggleTick = true;
                        sound.playSound("tok");
                    } else if (t % 2 == 0) {
                        scene.data.toggleTick = false;
                        sound.playSound("tik");
                    }

                }
            }
            if (scene.data.resetTimer) {
                scene.data.timerStart = Date.now() - scene.data.startTime;
                scene.data.resetTimer = false;
            }

            scene.data.dScore = lerp(scene.data.dScore, scene.data.score, 0.4);

            scene.data.gObjects = scene.data.gObjects.filter(o => o.alive);
            scene.data.frame++;
        }
    }

    static updateMenu(scene) {
        scene.data.frame++;
    }
}