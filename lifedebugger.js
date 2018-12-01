var helperDrawer = new LifeCanvasDrawer();
var life;
let intervalId = -1;

function init(life_) {
    life = life_;
    helperDrawer.init(document.getElementById("debugger_helper"));
    helperDrawer.background_color = "#000000";
    helperDrawer.cell_color = "#ff0000";

    helperDrawer.border_width = 0;
    helperDrawer.cell_width = 1;

    helperDrawer.set_size(32, 24);
}

function collectPeriod(viewport, periodLength) {
    life.set_step(0);
    helperDrawer.fit_bounds(viewport);
    for (let i = 0; i < periodLength; i++) {
        helperDrawer.redraw(life.root, i !== 0);
        life.next_generation(true);
    }
    return helperDrawer.get_image_data().slice(0);
}

function stop() {
    clearInterval(intervalId);
    intervalId = -1;
    life.set_step(0);
}

function runToPeriodBreak(viewport, callback, step=6, period=30) {
    stop();
    const periodBitmap = collectPeriod(viewport, period);
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