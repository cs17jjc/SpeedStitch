class TextureSheet {
    constructor(textureSheetImage, spriteSize) {
        this.sheetImage = textureSheetImage;
        this.spriteSize = spriteSize;
        this.spriteDefs = new Map();
    }
    defineSprite(name, xIndex, yIndex, width, height) {
        this.spriteDefs.set(name, {
            x: xIndex * this.spriteSize,
            y: yIndex * this.spriteSize,
            width: width * this.spriteSize,
            height: height * this.spriteSize
        })
    };
    drawSprite(name, ctx, x, y, w, h) {
        var sDef = this.spriteDefs.get(name);
        if (sDef != null) {
            ctx.drawImage(
                this.sheetImage,
                sDef.x,
                sDef.y,
                sDef.width,
                sDef.height,
                x,
                y,
                w,
                h
            )
        }
    }
}