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

        public static rotationZ(angleRadians: number): Matrix4x4 {
            let mat = Matrix4x4.identity();

            const c = Math.cos(angleRadians);
            const s = Math.sin(angleRadians);

            mat._data[0] = c;
            mat._data[1] = s;
            mat._data[5] = -s;
            mat._data[6] = c;

            return mat;
        }

        public static scale(scale: Vec3): Matrix4x4 {
            let mat = Matrix4x4.identity();

            mat._data[0] = scale.x;
            mat._data[5] = scale.y;
            mat._data[10] = scale.z;

            return mat;
        }

        public static multiply(a: Matrix4x4, b: Matrix4x4): Matrix4x4 {
            let out = Matrix4x4.identity();

            let sum: number = 0;
            for (let i = 0; i < 4;i++) {
                for (let j = 0; j < 4; j++) {
                    for (let k = 0; k < 4; k++) {
                        sum += a._data[k + i * 4] * b._data[k + j * 4];
                    }
                    out._data[i + j * 4] = sum;
                }
            }

            return out;
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