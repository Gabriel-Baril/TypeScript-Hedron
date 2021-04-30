namespace Hedron {
    export const ROOT_OBJECT_NAME = "__ROOT__";

    export class Scene {
        private _root: SimObject;

        public constructor() {
            this._root = new SimObject(0, ROOT_OBJECT_NAME, this);
        }

        public get root(): SimObject {
            return this._root;
        }

        public get isLoaded(): boolean {
            return this.root.isLoaded;
        }

        public addObject(object: SimObject): void {
            this._root.addChild(object);
        }

        public getObjectByName(name: string): SimObject {
            return this._root.getObjectByName(name);
        }

        public load(): void {
            this._root.load();
        }

        public update(dt: number): void {
            this._root.update(dt);
        }

        public render(shader: Shader): void {
            this._root.render(shader);
        }
    }
}