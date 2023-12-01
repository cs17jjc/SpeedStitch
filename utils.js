function lerp(a, b, t) {
    return (1 - t) * a + (t * b);
}

function checkIfPointInRectange(point, rect) {
    return (point.x >= rect.x) &&
        (point.x <= (rect.x + rect.width)) &&
        (point.y >= rect.y) &&
        (point.y <= (rect.y + rect.height));
}

function checkRectangeCollisions(rect1, rect2) {
    return checkRectangeCornerIntersects(rect1, rect2) || checkRectangeCornerIntersects(rect2, rect1);
}

function checkRectangeCornerIntersects(cRect, rect) {
    return checkIfPointInRectange({ x: cRect.x, y: cRect.y }, rect) ||
        checkIfPointInRectange({ x: cRect.x + cRect.width, y: cRect.y }, rect) ||
        checkIfPointInRectange({ x: cRect.x, y: cRect.y + cRect.height }, rect) ||
        checkIfPointInRectange({ x: cRect.x + cRect.width, y: cRect.y + cRect.height }, rect);
}

function updateAnimObject(anim, frameCounter) {
    if (frameCounter - anim.lastFrameTime > anim.rate) {
        anim.currentFrame = (anim.currentFrame == anim.frames.length - 1) ? 0 : (anim.currentFrame + 1);
        anim.lastFrameTime = frameCounter;
    }
}

function rnd(min, max) {
    return lerp(min, max, Math.random());
}

function calcDistance(a, b) { return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)) }

function calcAngle(a, b) {
    var o = b.x - a.x;
    var a = a.y - b.y;
    return Math.atan2(o, a);
}

function calcComponents(a, b) { return { x: a * Math.cos(b), y: a * Math.sin(b) } }

function scaleImage(image, scale) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width * scale;
    canvas.height = image.height * scale;
    var ctx = canvas.getContext("2d");
    //disable image smoothing 
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
}

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

function makeTimeString(a) {
    var b = Math.trunc(a / 1E3),
        d = parseInt(b / 60, 10),
        e = parseInt(b % 60, 10);
    a = Math.trunc(1E3 * ((a - b) / 1E3 - Math.trunc((a - b) / 1E3)));
    return (10 > d ? "0" + d : d) + ":" + (10 > e ? "0" + e : e)
}

function rndPick(a) {
    return a[Math.floor(Math.random() * a.length)];
}

function sortRenderOrder(a, b) {
    var order = ["ScorePoint", "Sheet", "Pin"];
    if (a == null) {
        return 1;
    }
    if (b == null) {
        return -1;
    }
    return order.indexOf(a.objClass) - order.indexOf(b.objClass);
}

function componentToHex(c) {
    var hex = Math.floor(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function rgbToHexAlpha(r, g, b, a) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(a);
}