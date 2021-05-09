namespace Hedron {
    export enum ZoneState {
        UNINITIALIZED,
        LOADING,
        UPDATING
    }

    export class Zone {
        private _name: string;
        private _description: string;
        private _id: number;
        private _scene: Scene;
        private _state: ZoneState = ZoneState.UNINITIALIZED;
        private _globalId: number = -1;

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

        public init(zoneData: any) {
            if (zoneData.objects === undefined) {
                throw new Error("Zone initialization exception: objects field not present")
            } else {
                for (let o in zoneData.objects) {
                    const obj = zoneData.objects[o];

                    this.loadSimObject(obj, this._scene.root);
                }
            }
        }

        public load(): void {
            this._state = ZoneState.LOADING;
            this._scene.load();
            this._state = ZoneState.UPDATING;
        }

        public unload(): void {
        }

        public update(dt: number): void {
            if (this._state === ZoneState.UPDATING) {
                this._scene.update(dt);
            }
        }

        public render(shader: Shader): void {
            if (this._state === ZoneState.UPDATING) {
                this._scene.render(shader);
            }
        }

        public onActivated(): void {

        }

        public onDeactivated(): void {

        }

        private loadSimObject(dataSection: any, parent: SimObject): void {
            let name: string;
            if (dataSection.name !== undefined) {
                name = String(dataSection.name);
            }

            this._globalId++;
            let simObject = new SimObject(this._globalId, name, this._scene);

            if (dataSection.transform !== undefined) {
                simObject.transform.setFromJson(dataSection.transform);
            }

            if (dataSection.components !== undefined) {
                for (let c in dataSection.components) {
                    let data = dataSection.components[c];
                    let component = ComponentManager.extractComponent(data);
                    simObject.addComponent(component);
                }
            }

            if (dataSection.children !== undefined) {
                for (let o in dataSection.children) {
                    const obj = dataSection.children[o];
                    this.loadSimObject(obj, simObject);
                }
            }

            if (parent !== undefined) {
                parent.addChild(simObject);
            }
        }
    }
}