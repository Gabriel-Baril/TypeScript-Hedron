namespace Hedron {
    export class SimObject {
        private _id: number;
        private _children: SimObject[] = [];
        private _parent: SimObject;
        private _isLoaded: boolean = false;
        private _scene: Scene;

        private _localMatrix: Matrix4x4 = Matrix4x4.identity();
        private _worldMatrix: Matrix4x4 = Matrix4x4.identity();


        public name: string;
        public transform: Transform = new Transform();

        public constructor(id: number, name: string, scene?: Scene) {
            this._id = id;
            this.name = name;
            this._scene = scene;
        }

        public get id(): number {
            return this._id;
        }

        public get parent(): SimObject {
            return this._parent;
        }

        public get worldMatrix(): Matrix4x4 {
            return this._worldMatrix;
        }

        public get isLoaded(): boolean {
            return this._isLoaded;
        }

        public addChild(child: SimObject): void {
            child._parent = this;
            this._children.push(child);
            child.onAdded(this._scene);
        }

        public removeChild(child: SimObject): void {
            const childIndex = this._children.indexOf(child) 
            if (childIndex !== -1) {
                child._parent = undefined;
                this._children.splice(childIndex, 1);
            }
        }

        public getObjectByName(name: string): SimObject {
            if (this.name === name) {
                return this;
            }

            for (let child of this._children) {
                let out = child.getObjectByName(name);
                if (out !== undefined) {
                    return out;
                }
            }

            return undefined;
        }

        public load(): void {
            this._isLoaded = true;
            for (let child of this._children) {
                child.load();
            }
        }

        public update(dt: number): void {
            for (let child of this._children) {
                child.update(dt);
            }
        }

        public render(shader: Shader): void {
            for (let child of this._children) {
                child.render(shader);
            }
        }

        protected onAdded(scene: Scene): void {
            this._scene = scene;
        }
    }
}