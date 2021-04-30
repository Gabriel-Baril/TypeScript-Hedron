namespace Hedron {
    export class Transform {
        public position: Vec3 = Vec3.zero;
        public rotation: Vec3 = Vec3.zero;
        public scale: Vec3 = Vec3.one;

        public copyFrom(tranform: Transform): void {
            this.position.copyFrom(tranform.position);
            this.rotation.copyFrom(tranform.rotation);
            this.scale.copyFrom(tranform.scale);
        }

        public getTransform(): Matrix4x4 {
            let translation = Matrix4x4.translation(this.position);
            let scale = Matrix4x4.scale(this.scale);
            let rotation = Matrix4x4.rotationZ(this.rotation.z); // Todo add x, y for 3d

            return Matrix4x4.multiply(Matrix4x4.multiply(translation, rotation), scale);
        }
    }

}