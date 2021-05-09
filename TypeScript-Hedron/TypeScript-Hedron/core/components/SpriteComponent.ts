namespace Hedron {

    export class SpriteComponentData implements IComponentData {
        public name: string;
        public materialName: String;

        public setFromJson(json: any) {
            if (json.name !== undefined) {
                this.name = String(json.name);
            }

            if (json.materialName !== undefined) {
                this.materialName = String(json.materialName);
            }
        }
    }

    export class SpriteComponentBuilder implements IcomponentBuilder {
        type: string;

        buildFromJson(json: any): IComponent {
            throw new Error("Method not implemented.");
        }
    }

    export class SpriteComponent extends BaseComponent {
        private _sprite: Sprite;

        public constructor(name: string, materialName: string) {
            super(name);
            this._sprite = new Sprite(name, materialName);
        }

        public load(): void {
            this._sprite.load();
        }

        public render(shader: Shader): void {
            this._sprite.draw(shader, this.owner.worldMatrix);
            super.render(shader);
        }
    }
}