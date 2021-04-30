namespace Hedron {
    export class Zone {
        private _name: string;
        private _description: string;
        private _id: number;
        private _scene: Scene;

        public constructor(id: number, name: string, description: string) {
            this._id = id;
            this._name = name;
            this._description = description;
            this._scene = new Scene;
        }

        public get id(): number {
            return this._id;
        }

        public get name(): string {
            return this._name;
        }

        public get description(): string {
            return this._description;
        }

        public get scene(): Scene {
            return this._scene;
        }

        public load(): void {
            this._scene.load();
        }

        public update(dt: number): void {
            this._scene.update(dt);
        }

        public render(shader: Shader): void {
            this._scene.render(shader);
        }
    }
}