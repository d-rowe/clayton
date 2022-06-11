import Renderer from './Renderer';
import { isDiatonic } from './utils/theoryUtils';

const container = document.getElementById('root');
if (!container) {
    throw new Error('No container');
}

// my heart goes out to anyone that reads this 🍝
const notes = 'CDEFGAB';
const keyLabels = new Map<number, string>();
let currentNoteIndex = 0;
let currentNoteLabel = '';
for (let midi = 2; midi <= 84; midi++) {
    const octave = Math.floor(midi / 12) - 1;
    if (isDiatonic(midi)) {
        if (currentNoteIndex >= notes.length - 1) {
            currentNoteIndex = 0;
        } else {
            currentNoteIndex++;
        }
        currentNoteLabel = notes.charAt(currentNoteIndex);
        keyLabels.set(midi, currentNoteLabel + octave);
    }
}

const renderer = new Renderer({
    container,
    onKeyClick: console.log,
    keyLabels,
    midiRange: [72, 84],
    animationDuration: 1000,
});

const ranges: [number, number][] = [
    [48, 51],
    [60, 72],
    [36, 60],
    [24, 36],
];

(async () => {
    while (true) {
        for (const range of ranges) {
            await renderer.setMidiRange(range);
            await delay(1000);
        }
    }
})();

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
