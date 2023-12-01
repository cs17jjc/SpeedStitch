class RenderScene {

    static render(scene, ctx) {
        switch (scene.name) {
            case 'game':
                RenderScene.renderGame(scene, ctx);
                break;
            case 'menu':
                //RenderScene.renderMenu(scene, ctx);
                break;
        }
    }

    static renderGame(scene, ctx) {

        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(0, 0, rWidth, rHeight);

        ctx.drawImage(textures.get("bgB"), 0, 0, rWidth, rHeight);
        var fg = textures.get("fg");
        ctx.drawImage(fg, 0, rHeight - fg.height * 2, rWidth, fg.height * 2);


        scene.data.gObjects.sort(sortRenderOrder);
        scene.data.gObjects.forEach(element => {
            this.renderObject(scene, element, ctx);
        });



        ctx.lineWidth = 12;

        ctx.strokeStyle = patterns.get("p2");
        ctx.beginPath();
        ctx.moveTo(scene.data.curHoles[0].x, scene.data.curHoles[0].y);
        scene.data.curHoles.filter(p => p.hit).slice(1).forEach(p => {
            ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = "#6a040f";
        ctx.beginPath();
        ctx.moveTo(scene.data.curHoles[0].x, scene.data.curHoles[0].y);
        scene.data.curHoles.filter(p => p.hit).slice(1).forEach(p => {
            ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        ctx.lineWidth = 6;
        ctx.strokeStyle = "#d00000";
        ctx.beginPath();
        ctx.moveTo(scene.data.curHoles[0].x, scene.data.curHoles[0].y);
        scene.data.curHoles.filter(p => p.hit).slice(1).forEach(p => {
            ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        ctx.globalAlpha = 1;

        scene.data.prevHoles.forEach(h => {
            ctx.lineWidth = 12;
            ctx.strokeStyle = patterns.get("p2");
            ctx.beginPath();
            ctx.moveTo(h[0].x, h[0].y);
            h.slice(1).forEach(p => {
                ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();

            ctx.globalAlpha = 0.8;
            ctx.strokeStyle = "#6a040f";
            ctx.beginPath();
            ctx.moveTo(h[0].x, h[0].y);
            h.slice(1).forEach(p => {
                ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();

            ctx.lineWidth = 6;
            ctx.strokeStyle = "#d00000";
            ctx.beginPath();
            ctx.moveTo(h[0].x, h[0].y);
            h.slice(1).forEach(p => {
                ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
            ctx.globalAlpha = 1;
        });

        ctx.lineWidth = 1;

        //Render pins infront of holes
        scene.data.gObjects.filter(o => o.objClass == "Pin").forEach(o => {
            this.renderPin(o, ctx, scene.data.failStitchFrame, scene.data.frame);
        });

        if (playing) {
            var timeCompleted = (scene.data.time - scene.data.timerStart) / scene.data.timerMax + 0.0;
            timeCompleted = Math.max(0, Math.min(1, timeCompleted));
            var shakeX = 0;
            if (timeCompleted > 0.75) {
                shakeX = Math.sin(scene.data.time / 10) * 5 * timeCompleted;
            }
            var timerX = rWidth * 0.88 + shakeX;
            var timerY = rHeight * 0.8;
            var timerR = 150 + Math.sin(scene.data.time / 500) * 3;
            var timerImg = textures.get("timer");
            ctx.filter = "drop-shadow(0px 0px 8px #000000)";
            ctx.drawImage(timerImg, timerX - timerR, timerY - timerR, timerR * 2, timerR * 2);
            ctx.filter = "none";

            ctx.lineWidth = 12;
            ctx.strokeStyle = "#000000EE";
            ctx.setLineDash([20, 10]);
            ctx.beginPath();
            ctx.moveTo(timerX, timerY);
            ctx.lineTo(timerX, timerY - (timerR - 30));
            ctx.stroke();

            ctx.lineWidth = 8;
            ctx.strokeStyle = "#000000";
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(timerX, timerY);
            var handAngle = Math.floor((timeCompleted * 2 * Math.PI - Math.PI / 2) * 10) / 10;
            var x = timerX + (timerR - 40) * Math.cos(handAngle);
            var y = timerY + (timerR - 40) * Math.sin(handAngle);
            ctx.lineTo(x, y);
            ctx.stroke();

            ctx.lineWidth = 1;



            ctx.filter = "drop-shadow(0px 0px 5px #000000)";
            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.moveTo(timerX, timerY)
            ctx.ellipse(timerX, timerY, 10, 10, Math.PI * -0.5, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.filter = "none";


            ctx.textAlign = "center";


            ctx.font = 'bold 130px Lato';
            ctx.fillStyle = "#05F258";
            ctx.fillText(Math.round(scene.data.dScore), rWidth * 0.5, rHeight * 0.12);

            var multiSize = 130;
            if (scene.data.frame - scene.data.stitchFrame < 10) {
                multiSize += Math.sin(scene.data.frame) * 10;
            }
            ctx.font = 'bold ' + Math.floor(multiSize) + 'px Lato';
            ctx.fillStyle = "#" + multArr[Math.min(multArr.length - 1, scene.data.multiplier - 1)];
            var multiXOff = 0;
            if (scene.data.frame - scene.data.failMultiplierFrame < 10) {
                multiXOff += Math.sin(scene.data.frame) * 10;
            }
            ctx.fillText("x" + scene.data.multiplier, rWidth * 0.5 + multiXOff, rHeight * 0.93);


            var nextTime = Math.floor((scene.data.timerMax - 1000) / 1000);
            var qTextYOff = Math.sin(scene.data.time / 500) * 3;
            if (nextTime > 0) {
                var sOff = 0;
                if (scene.data.frame - scene.data.batchFrame < 20) {
                    sOff = Math.sin((scene.data.frame - scene.data.batchFrame) / 2) * 4;
                }
                ctx.textBaseline = "middle";
                ctx.font = 'bold ' + Math.floor(80 + sOff) + 'px Lato';
                ctx.fillStyle = "#72ddf7";
                var quotaText = scene.data.completed + "/" + scene.data.quota + " Patches";
                ctx.fillText(quotaText, rWidth * 0.2, rHeight * 0.85 + qTextYOff);
                ctx.font = 'bold ' + Math.floor(60 + sOff) + 'px Lato';
                ctx.fillStyle = "#8093f1";
                quotaText = "till " + nextTime + "s timer";
                ctx.fillText(quotaText, rWidth * 0.2, rHeight * 0.91 + qTextYOff);
                ctx.textBaseline = "alphabetic";

            } else {
                ctx.font = 'bold 80px Lato';
                ctx.fillStyle = "#72ddf7";
                ctx.fillText("1s timer!", rWidth * 0.2, rHeight * 0.87 + qTextYOff);
            }
        } else {
            var titleYOff = Math.sin(scene.data.time / 500) * 3;
            ctx.drawImage(textures.get("title"), rWidth * 0.3, rHeight * 0.02 + titleYOff, rWidth * 0.4, rWidth * 0.2);
        }

    }

    static renderObject(scene, obj, ctx) {
        switch (obj.objClass) {
            case "Sheet":
                this.renderSheet(obj, ctx);
                break;
            case "ScorePoint":
                ctx.fillStyle = obj.data.colour + componentToHex(255 * (1 - ((scene.data.frame - obj.data.frameMade) / obj.data.lifetime)));
                ctx.font = 'bold 100px Lato';
                ctx.textAlign = "center";
                ctx.fillText("+" + obj.data.value, obj.pos.x, obj.pos.y);
                break;
        }
    }

    static renderAnimObject(x, y, w, h, anim, ctx) {
        if (anim.sourceType == "SHEET") {
            var sSheet = spritesheets.get(anim.imgSource);
            var frameName = anim.frames[anim.currentFrame];
            sSheet.drawSprite(frameName, ctx, x, y, w, h);
        } else {
            var img = textures.get(anim.frames[anim.currentFrame]);
            ctx.drawImage(img, x, y, w, h);
        }
    }

    static renderSheet(obj, ctx) {
        var width = obj.data.image.width;
        var height = obj.data.image.height;
        ctx.drawImage(obj.data.image, obj.pos.x - width / 2, obj.pos.y - height / 2, width, height);

        obj.data.leftHoles.forEach(h => {
            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.ellipse(h.x, h.y, 10, 10, 0, 0, 2 * Math.PI);
            ctx.fill();
        })
        obj.data.rightHoles.forEach(h => {
            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.ellipse(h.x, h.y, 10, 10, 0, 0, 2 * Math.PI);
            ctx.fill();
        })

        if (scene.data.day < 2) {
            ctx.textAlign = "center";
            var curHole = scene.data.curHoles[scene.data.index];
            var size = 100;
            var yOff = Math.sin(scene.data.time / 200) * 5;
            if (scene.data.frame - scene.data.holeFrame < 10) {
                size += Math.sin((scene.data.frame - scene.data.holeFrame) / 1.5) * 6;
            }
            ctx.font = 'bold ' + Math.floor(size) + 'px Lato';
            ctx.fillStyle = rgbToHex(255, 255, 245);
            if (curHole.side == "left") {
                if (!curHole.double) {
                    ctx.fillText("Tap A", rWidth * (0.5), rHeight * 0.78 + yOff);
                } else {
                    ctx.fillText("Hold S Tap A", rWidth * (0.5), rHeight * 0.78 + yOff);
                }
            } else {
                if (!curHole.double) {
                    ctx.fillText("Tap S", rWidth * (0.5), rHeight * 0.78 + yOff);
                } else {
                    ctx.fillText("Hold A Tap S", rWidth * (0.5), rHeight * 0.78 + yOff);
                }
            }
        }
    }

    static renderPin(obj, ctx, failFrame, frame) {
        ctx.translate(obj.pos.x, obj.pos.y);
        ctx.rotate(obj.data.angle);
        var size = 100;
        var x = 0;
        if (frame - failFrame < 10) {
            x += Math.sin(frame) * 10;
        }
        ctx.drawImage(textures.get("pin"), x, Math.sin(scene.data.time / 500) * 5, size, size);
        ctx.resetTransform();
    }

}