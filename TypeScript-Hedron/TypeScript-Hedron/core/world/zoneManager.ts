namespace Hedron {
    export class ZoneManager implements IMessageHandler {
        private static _globalZoneID: number = -1;
        // private static _zones: { [id: number]: Zone } = {};
        private static _registeredZones: { [id: number]: string } = {};
        private static _activeZone: Zone;
        private static _instance: ZoneManager;

        private constructor() {
        }

        public static init(): void {
            ZoneManager._instance = new ZoneManager();

            // TEMP
            ZoneManager._registeredZones[0] = "assets/zones/testZone.json";
        }

        public static setActiveZone(id: number): void {
            if (ZoneManager._activeZone !== undefined) {
                ZoneManager._activeZone.onDeactivated();
                ZoneManager._activeZone.unload();
                ZoneManager._activeZone = undefined;
            }

            if (ZoneManager._registeredZones[id] !== undefined) {
                if (AssetManager.isAssetLoaded(ZoneManager._registeredZones[id])) {
                    const asset = AssetManager.getAsset(ZoneManager._registeredZones[id]);
                    ZoneManager.loadZone(asset);
                } else {
                    Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + ZoneManager._registeredZones[id], ZoneManager._instance);
                    AssetManager.loadAsset(ZoneManager._registeredZones[id]);
                }

            } else {
                throw new Error("Zone id:" + id.toString() + " does not exist.")
            }
        }

        public static update(dt: number): void {
            if (ZoneManager._activeZone !== undefined) {
                ZoneManager._activeZone.update(dt);
            }
        }

        public static render(shader: Shader): void {
            if (ZoneManager._activeZone !== undefined) {
                ZoneManager._activeZone.render(shader);
            }
        }

        private static loadZone(asset: JsonAsset): void {
            let zoneData = asset.data;
            let zoneId: number;

            if (zoneData.id === undefined) {
                throw new Error("Zone file format exception: Zone id not present");
            } else {
                zoneId = Number(zoneData.id);
            }

            let zoneName: string;
            if (zoneData.name === undefined) {
                throw new Error("Zone file format exception: Zone name not present");
            } else {
                zoneName = String(zoneData.id);
            }

            let zoneDescription: string;
            if (zoneData.description !== undefined) {
                zoneDescription = String(zoneData.description);
            }


            ZoneManager._activeZone = new Zone(zoneId, zoneName, zoneDescription);
            ZoneManager._activeZone.init(zoneData);

            ZoneManager._activeZone.onActivated();
            ZoneManager._activeZone.load();

        }

        public onMessage(message: Message): void {
            if (message.code.indexOf(MESSAGE_ASSET_LOADER_ASSET_LOADED) !== -1) {
                console.log("Zone loaded:" + message.code);
                const asset = message.context as JsonAsset;
                ZoneManager.loadZone(asset);
            }
        }
    }
}