export interface Movable {
    move(deltaX: number, deltaY: number): void;
}


export class Point implements Movable{
    private _x!: number;
    private _y!: number;

    constructor(x: number, y: number) {
        this.setPosition(x, y);
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    set x(value: number) {
        this.validateCoordinate(value, 'x');
        this._x = value;
    }

    set y(value: number) {
        this.validateCoordinate(value, 'y');
        this._y = value;
    }

    setPosition(x: number, y: number): void {
        this.validateCoordinate(x, 'x');
        this.validateCoordinate(y, 'y');
        this._x = x;
        this._y = y;
    }

    move(deltaX: number, deltaY: number): void {
        this.x += deltaX;
        this.y += deltaY;
    }

    private validateCoordinate(value: any, coordinateName: string): void {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error(`Invalid value for ${coordinateName}: must be a number.`);
        }
    }
}


export class Rectangle implements Movable {
    constructor(
        public topLeft: Point,
        public topRight: Point,
        public bottomLeft: Point,
        public bottomRight: Point
    ) {}

    move(deltaX: number, deltaY: number): void {
        this.topLeft.move(deltaX, deltaY);
        this.topRight.move(deltaX, deltaY);
        this.bottomLeft.move(deltaX, deltaY);
        this.bottomRight.move(deltaX, deltaY);
    }

    getArea(): number {
        const width = Math.abs(this.topRight.x - this.topLeft.x);
        const height = Math.abs(this.topLeft.y - this.bottomLeft.y);
        return width * height;
    }

    rotate(angle: number): void {
        const cosTheta = Math.cos(angle);
        const sinTheta = Math.sin(angle);

        function rotatePoint(p: Point, origin: Point): void {
            const translatedX = p.x - origin.x;
            const translatedY = p.y - origin.y;

            const rotatedX = translatedX * cosTheta - translatedY * sinTheta;
            const rotatedY = translatedX * sinTheta + translatedY * cosTheta;

            p.x = rotatedX + origin.x;
            p.y = rotatedY + origin.y;
        }

        rotatePoint(this.topRight, this.topLeft);
        rotatePoint(this.bottomLeft, this.topLeft);
        rotatePoint(this.bottomRight, this.topLeft);
    }
    
    scale(factor: number): void {
        const centerX = (this.topLeft.x + this.bottomRight.x) / 2;
        const centerY = (this.topLeft.y + this.bottomRight.y) / 2;

        function scalePoint(p: Point, centerX: number, centerY: number, factor: number): void {
            p.x = centerX + (p.x - centerX) * factor;
            p.y = centerY + (p.y - centerY) * factor;
        }

        scalePoint(this.topLeft, centerX, centerY, factor);
        scalePoint(this.topRight, centerX, centerY, factor);
        scalePoint(this.bottomLeft, centerX, centerY, factor);
        scalePoint(this.bottomRight, centerX, centerY, factor);
    }

    getPerimeter(): number {
        const width = this.topRight.x - this.topLeft.x;
        const height = this.bottomLeft.y - this.topLeft.y;
        return 2 * (width + height);
    }
}


export class Square extends Rectangle {
    constructor(topLeft: Point, sideLength: number) {
        const topRight = new Point(topLeft.x + sideLength, topLeft.y);
        const bottomLeft = new Point(topLeft.x, topLeft.y + sideLength);
        const bottomRight = new Point(topLeft.x + sideLength, topLeft.y + sideLength);

        super(topLeft, topRight, bottomLeft, bottomRight);

        if (sideLength <= 0) {
            throw new Error("Side length must be a positive number.");
        }
    }

    move(deltaX: number, deltaY: number): void {
        super.move(deltaX, deltaY);
    }

    setSideLength(newSideLength: number): void {
        if (newSideLength <= 0) {
            throw new Error("Side length must be a positive number.");
        }

        this.topRight.x = this.topLeft.x + newSideLength;
        this.bottomLeft.y = this.topLeft.y + newSideLength;
        this.bottomRight.x = this.topLeft.x + newSideLength;
        this.bottomRight.y = this.topLeft.y + newSideLength;
    }


    getSideLength(): number {
        return this.topRight.x - this.topLeft.x;
    }
}

const point1 = new Point(0, 0);
const point2 = new Point(5, 0);
const point3 = new Point(0, -5);
const point4 = new Point(5, -5);

const rectangle_test = new Rectangle(point1, point2, point3, point4);

function testMovable(movable: Movable): void {
    console.log("Move the object...");
    movable.move(3, 3);
}

console.log("Before ", point1);
//console.log("Before ", rectangle_test);

testMovable(point1);
//testMovable(rectangle_test);

console.log("\nPosition of the point after shifting:", point1);
//console.log("The position of the rectangle after shifting:", rectangle_test);



const rectangle = new Rectangle(new Point(0, 0), new Point(5, 0), new Point(0, -5), new Point(5, -5));

console.log("\nBefore rotate:");
console.log(rectangle);

rectangle.rotate(Math.PI / 4); // 45 stopni

//rectangle.rotate(Math.PI / 2); // 90 stopni

console.log("\nAfter rotate:");
console.log(rectangle);


const rectangle_scale = new Rectangle(new Point(0, 0), new Point(5, 0), new Point(0, -5), new Point(5, -5));

console.log("\nBefore scale:");
console.log(rectangle_scale);

rectangle_scale.scale(2); //2x

console.log("\nAfter scale (2x):");
console.log(rectangle_scale);

rectangle_scale.scale(0.5); //0.5x

console.log("\nAfter scale (0.5x):");
console.log(rectangle_scale);




const topLeftPoint = new Point(2, 3);
const square = new Square(topLeftPoint, 5);

console.log("\nInitial square:", square);
console.log("Area of square:", square.getArea());

square.move(2, 2);
console.log("\nMoved square:", square);

square.setSideLength(10);
console.log("\nResized square:", square);
console.log("New area of square:", square.getArea());





const rectangle_perimeter = new Rectangle(new Point(2, 3), new Point(7, 3), new Point(2, 8), new Point(7, 8));

console.log("\nRectangle area:", rectangle_perimeter.getArea());
console.log("Rectangle perimeter:", rectangle_perimeter.getPerimeter());


console.log("\n\n\n");

let testPoint = new Point(NaN, 2);