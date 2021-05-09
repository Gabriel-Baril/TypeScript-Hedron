namespace Hedron {
    export class ZoneManager {
        private static _globalZoneID: number = -1;
        private static _zones: { [id: number]: Zone } = {};
        private static _activeZone: Zone;

        private constructor() {
        }

        public static registerZone(name: string, description: string): number {
            ZoneManager._globalZoneID++;
            let zone = new Zone(ZoneManager._globalZoneID, name, description);
            ZoneManager._zones[ZoneManager._globalZoneID] = zone;
            return ZoneManager._globalZoneID;
        }

        // TODO: Temporary code
        public static createTestZone(): number {
            ZoneManager._globalZoneID++;
            let zone = new TestZone(ZoneManager._globalZoneID, "test", "Simple text zone");
            ZoneManager._zones[ZoneManager._globalZoneID] = zone;
            return ZoneManager._globalZoneID;
        }

        public static setActiveZone(id: number): void {
            if (ZoneManager._activeZone !== undefined) {
                ZoneManager._activeZone.onDeactivated();
                ZoneManager._activeZone.unload();
            }

            if (ZoneManager._zones[id] !== undefined) {
                ZoneManager._activeZone = ZoneManager._zones[id];
                ZoneManager._activeZone.onActivated();
                ZoneManager._activeZone.load();
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
    }
}