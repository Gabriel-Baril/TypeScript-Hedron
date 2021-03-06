namespace Hedron {
    export interface IAssetLoader {
        readonly supportedExtensions: string[];
        loadAsset(assetName: string): void;
    }
}