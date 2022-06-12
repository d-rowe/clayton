import Renderer from './Renderer';
import {createDefaultLabels} from './utils/keyLabels';

const container = document.getElementById('root');
if (!container) {
    throw new Error('No container');
}


const renderer = new Renderer({
    container,
    onKeyClick: console.log,
    keyLabels: createDefaultLabels(),
    midiRange: [72, 84],
    animationDuration: 1000,
});

const ranges: [number, number][] = [
    [48, 59],
    [60, 67],
    [36, 55],
    [24, 36],
];

(async () => {
    for (let i = 0; i < 9999; i++) {
        for (const range of ranges) {
            await renderer.setMidiRange(range);
            await delay(1000);
        }
    }
})();

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
