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

    helperDrawer.set_size(30, 30);
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

function runToPeriodBreak(viewport, callback, step = 6) {
    clearInterval(intervalId);
    const periodBitmap = collectPeriod(viewport);
    life.set_step(step);
    let stepCount = 0;
    function checkNextGeneration() {
        life.next_generation(true);
        helperDrawer.redraw(life.root);
        const bitmap = helperDrawer.get_image_data();
        for (let i = 0; i < bitmap.length; i++) {
            if (bitmap[i] > periodBitmap[i]) {
                clearInterval(intervalId);
                intervalId = -1;
                life.set_step(0);
                callback(true);
            }
        }
        if (++stepCount > 10000) {
            clearInterval(intervalId);
            callback(false);
        }
    }
    intervalId = setInterval(checkNextGeneration, 0);
    return intervalId;
}

export { init, runToPeriodBreak }