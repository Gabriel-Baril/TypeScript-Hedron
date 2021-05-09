namespace Hedron {
    export abstract class BaseComponent {
        protected _owner: SimObject;
        public name: string;

        public constructor(name: string) {

        }

        public get owner(): SimObject {
            return this._owner;
        }

        public setOwner(owner: SimObject): void {
            this._owner = owner;
        }

        public load(): void {

        }

        public update(dt: number): void {

        }

        public render(shader: Shader): void {

        }
    }
}