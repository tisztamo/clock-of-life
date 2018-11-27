import * as lifedebugger from "./lifedebugger.js";

let uiInited = false;
let mouseActiveTimeout;
let noMouseCheckTimout = 0;

const byClass = function(className) {
    return Array.from(document.getElementsByClassName(className));
}

const byId = function(id) {
    return document.getElementById(id);
}

let clock;

function initUi(clock_) {
    clock = clock_;
    if (uiInited) {
        return;
    }
    uiInited = true;

    lifedebugger.init(clock.life);

    document.addEventListener("mousemove", () => {
        if (noMouseCheckTimout) {
            return;
        }
        document.body.classList.add("mouseactive");
        clearTimeout(mouseActiveTimeout);
        mouseActiveTimeout = setTimeout(() => document.body.classList.remove("mouseactive"), 10000);
        noMouseCheckTimout = setTimeout(() => noMouseCheckTimout = 0, 1000);
    })

    byId("manual_button").addEventListener("click", () => {
        clock.toManual();
        updateUi();
    });
    byId("auto_button").addEventListener("click", () => {
        clock.toAuto();
        updateUi();
    });
    byId("to_period_break_button").addEventListener("click", runToPeriodBreakHandler);
    byId("stop_run_to_signal").addEventListener("click", stopRunToPeriodBreakHandler);
}

function runToPeriodBreakHandler() {
    lifedebugger.runToPeriodBreak(clock.drawer.get_viewport(), function(success) {
        if (!success) {
            alert("No signal found");
        }
        updateUi();
    }, Number(byId("debugger_step").value));
    updateUi();
}

function stopRunToPeriodBreakHandler() {
    lifedebugger.stop();
    updateUi();
}

function updateUi() {
    byClass("controls").forEach(control => {
        ["auto", "manual", "debugging"].forEach(mode => control.classList.remove(mode));
        control.classList.add(clock.mode);
        lifedebugger.isRunning() && control.classList.add("debugging");
    })
    byClass("debug_norun").forEach(input => {
        input.disabled = lifedebugger.isRunning() ? "disabled" : "";
    })
}


export { initUi }