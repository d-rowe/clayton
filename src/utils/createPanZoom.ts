type Options = {
    onStart: () => void,
    onEnd: () => void,
    onPanX: (panX: number) => void,
    onZoom: (scale: number) => void,
};

export default function createPanZoom(opts: Options): (e: WheelEvent) => void {
    const PAN_DELTA_FACTOR = 0.1;
    const SCALE_DELTA_FACTOR = 0.01;
    const END_TIMEOUT = 250;
    let endTimeoutId: number | undefined;
    let active = false;
    let scale = 1;
    let panX = 0;

    return function onWheel(e: WheelEvent) {
        e.preventDefault();

        if (!active) {
            opts.onStart();
            active = true;
        }

        if (endTimeoutId) {
            window.clearTimeout(endTimeoutId);
        }

        if (e.ctrlKey) {
            scale -= e.deltaY * SCALE_DELTA_FACTOR;
            opts.onZoom(scale);
        } else {
            panX -= e.deltaX * PAN_DELTA_FACTOR;
            opts.onPanX(panX);
        }

        endTimeoutId = window.setTimeout(onTimeout, END_TIMEOUT);
    }

    function onTimeout() {
        opts.onEnd();
        active = false;
        scale = 1;
        panX = 0;
    }
}
