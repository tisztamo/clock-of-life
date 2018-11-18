
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
    })
}

function updateUi() {
    byClass("controls").forEach(control => {
        ["auto", "manual"].forEach(mode => control.classList.remove(mode));
        control.classList.add(clock.mode);
    })
}


export { initUi }