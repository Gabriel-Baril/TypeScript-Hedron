namespace Hedron {

    export class Matrix4x4 {
        private _data: number[] = [];

        private constructor() {
            this._data = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ];
        }

        public get data(): number[] {
            return this._data;
        }

        public static identity(): Matrix4x4 {
            return new Matrix4x4();
        }

        public static orthographic(left: number, right: number, bottom: number, top: number, nearClip: number, farClip: number): Matrix4x4 {
            let mat = Matrix4x4.identity();

            let lr: number = 1.0 / (left - right);
            let bt: number = 1.0 / (bottom - top);
            let nf: number = 1.0 / (nearClip - farClip);

            mat._data[0] = -2.0 * lr;

            mat._data[5] = -2.0 * bt;

            mat._data[10] = 2.0 * nf;

            mat._data[12] = (left + right) * lr;
            mat._data[13] = (top + bottom) * bt;
            mat._data[14] = (farClip + nearClip) * nf;

            return mat;
        }

        public static translation(position: Vec3): Matrix4x4 {
            let mat = Matrix4x4.identity();

            mat._data[12] = position.x;
            mat._data[13] = position.y;
            mat._data[14] = position.z;

            return mat;
        }
    }
}