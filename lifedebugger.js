var helperDrawer = new LifeCanvasDrawer();
var life;
var period;
let intervalId = -1;

function init(life_, period_ = 30) {
    period = period_;
    life = life_;
    helperDrawer.init(document.getElementById("debugger_helper"));
    helperDrawer.background_color = "#000000";
    helperDrawer.cell_color = "#ff0000";

    helperDrawer.border_width = 0;
    helperDrawer.cell_width = 1;

    helperDrawer.set_size(32, 24);
}

function collectPeriod(viewport) {
    life.set_step(0);
    helperDrawer.fit_bounds(viewport);
    for (let i = 0; i < period; i++) {
        helperDrawer.redraw(life.root, i !== 0);
        life.next_generation(true);
    }
    return helperDrawer.get_image_data().slice(0);
}

function stop() {
    clearInterval(intervalId);
    intervalId = -1;
}

function runToPeriodBreak(viewport, callback, step = 6) {
    stop();
    const periodBitmap = collectPeriod(viewport);
    life.set_step(step);
    let stepCount = 0;
    function checkNextGeneration() {
        life.next_generation(true);
        helperDrawer.redraw(life.root);
        const bitmap = helperDrawer.get_image_data();
        for (let i = 0; i < bitmap.length; i++) {
            if (bitmap[i] > periodBitmap[i]) {
                stop();
                life.set_step(0);
                callback(true);
            }
        }
        if (++stepCount > 10000) {
            stop();
            callback(false);
        }
    }
    intervalId = setInterval(checkNextGeneration, 0);
    return intervalId;
}

function isRunning() {
    return intervalId !== -1;
}

export { init, runToPeriodBreak, isRunning, stop }