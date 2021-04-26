var Hedron;
(function (Hedron) {
    var Engine = /** @class */ (function () {
        function Engine() {
            this._frameCount = 0;
        }
        Engine.prototype.init = function () {
            this.loop();
        };
        Engine.prototype.loop = function () {
            this._frameCount++;
            document.title = this._frameCount.toString();
            requestAnimationFrame(this.loop.bind(this)); // Call this.loop on this specific instance to emulate an infinite loop
        };
        return Engine;
    }());
    Hedron.Engine = Engine;
})(Hedron || (Hedron = {}));
window.onload = function () {
    var engine = new Hedron.Engine();
    engine.init();
};
//# sourceMappingURL=main.js.map