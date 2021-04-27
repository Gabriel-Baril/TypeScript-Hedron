
var engine: Hedron.Engine;

// The entry point of our application
window.onload = function () {
    engine = new Hedron.Engine();
    engine.start();
}

window.onresize = function () {
    engine.resize();
}

