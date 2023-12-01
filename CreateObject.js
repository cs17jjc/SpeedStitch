class Create {
    static gameObject(objClass, x, y, data) {
        return { objClass, pos: { x, y }, vel: { x: 0, y: 0 }, data, alive: true };
    }

    static animation(imgSource, sourceType, frames, rate, frame) {
        return { imgSource, sourceType, frames, rate, currentFrame: 0, lastFrameTime: frame }
    }

    static hole(yOff, index) {
        return { x: 0, y: 0, yOff, index, hit: false, last: false, double: false };
    }

    static holes(length, doubleChance) {
        var yStep = 50;
        var left = [];
        var right = [];
        var wasDouble = false;
        var n = Math.floor(length / yStep);
        for (let i = 0; i < n; i++) {
            var nextIndex = left.length + right.length;
            var y = (i * -yStep) + ((n - 1) * yStep);
            if (i == 0) {
                if (Math.random() > 0.5) {
                    left.push(Create.hole(y, nextIndex));
                } else {
                    right.push(Create.hole(y, nextIndex));
                }
            } else if (i == n - 1) {
                if (left.length > 0 && left[0].index == 0) {
                    right.push(Create.hole(y, nextIndex));
                } else {
                    left.push(Create.hole(y, nextIndex));
                }
            } else {
                if (Math.random() > doubleChance || wasDouble) {
                    if (Math.random() > 0.5) {
                        left.push(Create.hole(y, nextIndex));
                    } else {
                        right.push(Create.hole(y, nextIndex));
                    }
                    wasDouble = false;
                } else {
                    var lastLeft = left[left.length - 1];
                    if (lastLeft != null && lastLeft.index == nextIndex - 1) {
                        left.push(Create.hole(y, nextIndex));
                        var double = Create.hole(y, nextIndex + 1)
                        double.double = true;
                        right.push(double);
                    } else {
                        right.push(Create.hole(y, nextIndex));
                        var double = Create.hole(y, nextIndex + 1)
                        double.double = true;
                        left.push(double);
                    }
                    wasDouble = true;
                }
            }
        }
        return [left, right];
    }

    static sheet(x, y, width, leftH, rightH, leftHoles, rightHoles) {
        //create temp canvas
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = Math.max(leftH, rightH);
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = patterns.get("p1");
        var pOffY = 0;
        ctx.translate(0, pOffY);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2 - leftH / 2 - pOffY);
        ctx.lineTo(0, canvas.height / 2 + leftH / 2 - pOffY);
        ctx.lineTo(width, canvas.height / 2 + rightH / 2 - pOffY);
        ctx.lineTo(width, canvas.height / 2 - rightH / 2 - pOffY);
        ctx.closePath();
        ctx.fill();
        ctx.resetTransform();

        ctx.fillStyle = "#" + rndPick(["264653", "2a9d8f", "e9c46a", "f4a261", "e76f51"]);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2 - leftH / 2);
        ctx.lineTo(0, canvas.height / 2 + leftH / 2);
        ctx.lineTo(width, canvas.height / 2 + rightH / 2);
        ctx.lineTo(width, canvas.height / 2 - rightH / 2);
        ctx.closePath();
        ctx.globalAlpha = 0.5;
        ctx.fill();
        ctx.globalAlpha = 1;

        return Create.gameObject("Sheet", x, y, { leftH, rightH, width, leftHoles, rightHoles, id: 0, image: canvas });
    }

    static scorePoint(x, y, value, frameMade, lifetime) {
        var colour = "#" + rndPick(["003049", "d62828", "f77f00"]);
        var sp = Create.gameObject("ScorePoint", x, y, { value, frameMade, lifetime, colour });
        sp.vel.y = -10;
        return sp;
    }

    static pin(x, y, follow, angle) {
        return Create.gameObject("Pin", x, y, { follow, angle });
    }

}