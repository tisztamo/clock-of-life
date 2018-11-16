const CLOCK_PERIOD = 11520;
var life;
var drawer;
var setup_pattern;

function init(_life, _drawer, _setup_pattern) {
    life = _life;
    drawer = _drawer;
    setup_pattern = _setup_pattern;
}

function forEachCell(node, x, y, cb) {
    if (node.population === 0) {
        return;
    }
    if (node.level === 0) {
        cb(x, y);
        return;
    }

    if (node.level == 1) {
        forEachCell(node.nw, x - 1, y - 1, cb);
        forEachCell(node.sw, x - 1, y, cb);
        forEachCell(node.ne, x, y - 1, cb);
        forEachCell(node.se, x, y, cb);
        return;
    }
    var offset = node.level === 1 ? 0 : life.pow2(node.level - 2);

    forEachCell(node.nw, x - offset, y - offset, cb);
    forEachCell(node.sw, x - offset, y + offset, cb);
    forEachCell(node.ne, x + offset, y - offset, cb);
    forEachCell(node.se, x + offset, y + offset, cb);
}

function clearHash() {
    const bounds = life.get_root_bounds();
    const width = bounds.right - bounds.left + 1;
    const size = (bounds.bottom - bounds.top + 1) * width;
    console.log("Allocating " + size);
    const array = new Uint8Array(size);
    const bottom = bounds.bottom;
    const top = bounds.top;
    const right = bounds.right;
    const left = bounds.left;
    let idx = 0;

    var ts = Date.now();
    forEachCell(life.root, 0, 0, (x, y) => {
        array[(y - top) * width + x - left] = 1;
    });
    var ts1 = Date.now();
    console.log("Read time: " + (ts1 - ts))
    life.clear_pattern();
    life.save_rewind_state();

    idx = 0;
    for(let y = bounds.top; y <= bottom; y++)
    {
        for(let x = left; x <= right; x++)
        {
            if (array[idx] === 1) {
                life.set_bit(x, y, true);
            }
            idx += 1;
        }
    }
    console.log("Rewrite time: " + (Date.now() - ts1))
}

let step = 1;
let log_step = 0;
let msecs_per_frame;
let targetStep = 0;

function setStep(new_log_step) {
    if (log_step !== new_log_step) {
        life.set_step(new_log_step);
        step = Math.pow(2, new_log_step);
        msecs_per_frame = 60000 / (CLOCK_PERIOD / step);
        log_step = new_log_step;
        console.log("Step: " + log_step);
    }
}

function calculateTargetStep() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(0);
    midnight.setMinutes(0);
    midnight.setSeconds(0);
    midnight.setMilliseconds(0);
    const targetMsecs = now - midnight;
    targetStep = targetMsecs / (60000 / CLOCK_PERIOD);
    return targetStep;
}

var gc_counter = 0;
function leakWorkaround() {
    if (++gc_counter > 5000) {
        gc_counter = 0;
        clearHash();
    };
}

let stepUpdateCounter = 0;
function updateStep(lag) {
    stepUpdateCounter += 1;
    if (stepUpdateCounter > 0) {
        stepUpdateCounter = 0;
        const stepLag = lag / (60000 / CLOCK_PERIOD);
        const xx =  stepLag / (20 * step);
        let targetLogStep = Math.round(Math.log2(xx)) + 2;
        targetLogStep = Math.max(5, Math.min(targetLogStep, 16))
        if (targetLogStep > log_step) {
            setStep(log_step + 1)
        } else if (targetLogStep < log_step) {
            setStep(targetLogStep);
        }
    }
}

function run(update_hud)
{
    let start;
    let frameIdx = 0;
    let totalSteps = 0;
    let fps = 0;
    let lastTs = 0

    function updateFps(time) {
        fps = 0.99 * fps + 0.01 * (1000 / (time - lastTs))
        update_hud(fps);
        lastTs = time;
    }

    function nextFrame() {
        frameIdx += 1;
        totalSteps += step;
    }

    function update()
    {
        const time = Date.now();
        calculateTargetStep();
        const lag = (targetStep - totalSteps) * msecs_per_frame;
        if (lag > 10) {
            updateStep(lag);
            life.next_generation(true);
            nextFrame();
            drawer.redraw(life.root);
            updateFps(time);
            leakWorkaround();
        }
    }

    start = Date.now();
    setStep(5);
    nextFrame();
    setInterval(update, 1000 / 7);
    update();
}

export { init, run }