namespace Hedron {
    export class Vec2 {
        private _x: number;
        private _y: number;

        public constructor(x: number = 0, y: number = 0) {
            this._x = x;
            this._y = y;
        }

        public get x(): number {
            return this._x;
        }

        public set x(value: number) {
            this._x = value;
        }

        public get y(): number {
            return this._y;
        }

        public set y(value: number) {
            this._y = value;
        }

        public toArray(): number[] {
            return [this._x, this._y];
        }

        public toFloat32Array(): Float32Array {
            return new Float32Array(this.toArray());
        }

        public setFromJson(json: any): void {
            if (json.x !== undefined) {
                this._x = Number(json.x)
            }

            if (json.y !== undefined) {
                this._y = Number(json.y)
            }
        }
    }
}