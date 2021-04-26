// The entry point of our application
window.onload = function () {
    var engine = new Hedron.Engine();
    engine.start();
};
var Hedron;
(function (Hedron) {
    /**
     * The main game engine class
     * */
    var Engine = /** @class */ (function () {
        function Engine() {
            this._frameCount = 0;
        }
        Engine.prototype.start = function () {
            this._canvas = Hedron.GLUtilities.init("main-context");
            Hedron.gl.clearColor(0, 0, 0, 1);
            this.loop();
        };
        Engine.prototype.loop = function () {
            this._frameCount++;
            Hedron.gl.clear(Hedron.gl.COLOR_BUFFER_BIT);
            requestAnimationFrame(this.loop.bind(this)); // Call this.loop on this specific instance to emulate an infinite loop
        };
        return Engine;
    }());
    Hedron.Engine = Engine;
})(Hedron || (Hedron = {}));
var Hedron;
(function (Hedron) {
    /**
     * Responsible for setting up a WebGL rendering context
     */
    var GLUtilities = /** @class */ (function () {
        function GLUtilities() {
        }
        GLUtilities.init = function (elementId) {
            var canvas;
            if (elementId !== undefined) {
                canvas = document.getElementById(elementId);
                if (canvas === undefined) {
                    throw new Error("Cannot find element with id: " + elementId);
                }
            }
            else {
                canvas = document.createElement("canvas");
                document.body.appendChild(canvas);
            }
            Hedron.gl = canvas.getContext("webgl");
            if (Hedron.gl === undefined) {
                throw new Error("Unable to initialize WebGL!");
            }
            return canvas;
        };
        return GLUtilities;
    }());
    Hedron.GLUtilities = GLUtilities;
})(Hedron || (Hedron = {}));
//# sourceMappingURL=main.js.map