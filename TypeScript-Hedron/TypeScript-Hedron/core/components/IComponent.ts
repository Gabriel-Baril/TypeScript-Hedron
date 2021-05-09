namespace Hedron {
    export interface IComponent {
        name: string;
        readonly owner: SimObject;

        setOwner(owner: SimObject): void;
        load(): void;
        update(dt: number): void;
        render(shader: Shader): void;
    }
}