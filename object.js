class MonlarBlock {
    constructor(_x, _y, _w, _h, _densityCount, _randomness, _baseColor, _blockLevel, _shapeType = 0) {
        this.x = _x;
        this.y = _y;
        this.w = _w;
        this.h = _h;
        this.randomness = _randomness;
        this.drawCount = _densityCount;
        this.baseColor = _baseColor;

        this.blockLevel = _blockLevel;
        this.segmentsCount = this.blockLevel * 2 - 1;
        this.segmentsWidth = this.w / this.segmentsCount;

        this.shapeType = _shapeType;
    }

    randomEdgePoint() {
        let xIndex = int(random(0, this.segmentsCount + 1));
        let yIndex = int(random(0, this.segmentsCount + 1));

        return [xIndex, yIndex];
    }

    getNearPoint(_xIndex, _yIndex) {

        while (true) {
            let direction = int(random(0, 4));

            // up
            if (direction == 0) {
                if (_yIndex - 1 >= 0) {
                    return [_xIndex, _yIndex - 1];
                }
                else
                    continue;
            }

            // down
            if (direction == 1) {
                if (_yIndex + 1 < this.segmentsCount) {
                    return [_xIndex, _yIndex + 1];
                }
                else
                    continue;
            }

            // left
            if (direction == 2) {
                if (_xIndex - 1 >= 0) {
                    return [_xIndex - 1, _yIndex];
                }
                else
                    continue;
            }

            // right
            if (direction == 3) {
                if (_xIndex + 1 < this.segmentsCount) {
                    return [_xIndex + 1, _yIndex];
                }
                else
                    continue;
            }
        }

    }

    draw() {
        if (this.shapeType == 0)
            this.drawLines();
        else if (this.shapeType == 1)
            this.drawRectangles();
    }

    async drawLines() {
        // draw lines
        let fromCoord = this.randomEdgePoint();
        let toCoord = this.randomEdgePoint();

        let fromX = fromCoord[0] * this.segmentsWidth + random(-this.randomness, this.randomness) * this.segmentsWidth;
        let fromY = fromCoord[1] * this.segmentsWidth + random(-this.randomness, this.randomness) * this.segmentsWidth;
        let toX = toCoord[0] * this.segmentsWidth + random(-this.randomness, this.randomness) * this.segmentsWidth;
        let toY = toCoord[1] * this.segmentsWidth + random(-this.randomness, this.randomness) * this.segmentsWidth;

        for (let i = 0; i < this.drawCount; i++) {
            push();
            translate(this.x, this.y);

            stroke(this.baseColor.color());
            line(fromX, fromY, toX, toY);

            pop();
            await sleep(1);

            fromCoord = toCoord;
            fromX = toX;
            fromY = toY;

            if (random() < 0.5) {
                toCoord = this.getNearPoint(toCoord[0], toCoord[1]);
            }
            else {
                toCoord = this.randomEdgePoint();
            }

            toX = toCoord[0] * this.segmentsWidth + random(-this.randomness, this.randomness) * this.segmentsWidth;
            toY = toCoord[1] * this.segmentsWidth + random(-this.randomness, this.randomness) * this.segmentsWidth;
        }
    }

    async drawRectangles() {
        // draw rectangles
        for (let i = 0; i < this.drawCount; i++) {

            let rectLevel = int(random(0, this.blockLevel));

            let startX = rectLevel * this.segmentsWidth;
            let startY = rectLevel * this.segmentsWidth;

            let rectWidth = this.w - this.segmentsWidth * rectLevel * 2;
            let rectHeight = this.w - this.segmentsWidth * rectLevel * 2;

            let pointAX = startX + random(-this.randomness, this.randomness) * this.segmentsWidth;
            let pointAY = startY + random(-this.randomness, this.randomness) * this.segmentsWidth;

            let pointBX = startX + rectWidth + random(-this.randomness, this.randomness) * this.segmentsWidth;
            let pointBY = startY + random(-this.randomness, this.randomness) * this.segmentsWidth;

            let pointCX = startX + rectWidth + random(-this.randomness, this.randomness) * this.segmentsWidth;
            let pointCY = startY + rectHeight + random(-this.randomness, this.randomness) * this.segmentsWidth;

            let pointDX = startX + random(-this.randomness, this.randomness) * this.segmentsWidth;
            let pointDY = startY + rectHeight + random(-this.randomness, this.randomness) * this.segmentsWidth;

            push();
            translate(this.x, this.y);

            stroke(this.baseColor.color());
            line(pointAX, pointAY, pointBX, pointBY);
            line(pointBX, pointBY, pointCX, pointCY);
            line(pointCX, pointCY, pointDX, pointDY);
            line(pointDX, pointDY, pointAX, pointAY);

            pop();

            await sleep(1);
        }
    }
}

class ValueParameter {
    constructor(_valueMin, _valueMax, _type) {
        this.type = _type;
        this.valueMin = _valueMin;
        this.valueMax = _valueMax;
        this.value = 0;

        if (_type == 'CONSTANT') {
            this.value = random(_valueMin, _valueMax);
        }
    }

    getValue(_xt, _yt, _noiseValue) {
        if (this.type == 'CONSTANT')
            return this.value;
        else if (this.type == 'XT')
            return lerp(this.valueMin, this.valueMax, _xt);
        else if (this.type == 'YT')
            return lerp(this.valueMin, this.valueMax, _yt);
        else if (this.type == 'NOISE')
            return lerp(this.valueMin, this.valueMax, _noiseValue);
        else if (this.type == '1-XT')
            return lerp(this.valueMin, this.valueMax, 1.0 - _xt);
        else if (this.type == '1-YT')
            return lerp(this.valueMin, this.valueMax, 1.0 - _yt);
        else if (this.type == 'RANDOM')
            return random(this.valueMin, this.valueMax);
    }
}

class NYColor {
    constructor(_h, _s, _b, _a = 1.0) {
        this.h = _h;
        this.s = _s;
        this.b = _b;
        this.a = _a;

        this.hDiff = 30;
        this.sDiff = 30;
        this.bDiff = 30;
        this.aDiff = 0;
    }

    copy() {
        let newColor = new NYColor(this.h, this.s, this.b, this.a);
        newColor.hDiff = this.hDiff;
        newColor.sDiff = this.sDiff;
        newColor.bDiff = this.bDiff;

        return newColor;
    }

    slightRandomize() {
        this.h += random(-0.5 * this.hDiff, 0.5 * this.hDiff);
        this.s += random(-0.5 * this.sDiff, 0.5 * this.sDiff);
        this.b += random(-0.5 * this.bDiff, 0.5 * this.bDiff);
        this.a += random(-0.5 * this.aDiff, 0.5 * this.aDiff);

        this.h = processHue(this.h);
    }

    newSlightRandomColor() {
        let newColor = this.copy();
        newColor.slightRandomize();
        return newColor;
    }

    color() {
        return color(this.h, this.s, this.b, this.a);
    }

    static newRandomColor(_mainHue) {
        let h = processHue(_mainHue + random(-80, 80));
        let s = random(40, 100);
        let b = random(60, 100);

        return new NYColor(h, s, b);
    }
}


