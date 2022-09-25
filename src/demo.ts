import Renderer from './Renderer';
import {createDefaultLabels} from './lib/keyLabels';

const container = document.getElementById('root');
if (!container) {
    throw new Error('No container');
}

const renderer = new Renderer({
    container,
    keyLabels: createDefaultLabels(),
    midiRange: [60, 71],
});

const keyElements = Array.from(document.getElementsByClassName('c-piano-key')) as HTMLDivElement[];

let lastX = 0;

for (let i = 0; i < keyElements.length - 1; i++) {
    const keyElement = keyElements[i];
    const nextKeyElement = keyElements[i + 1];
    const isDiatonic = keyElement.classList.contains('c-piano-key-diatonic');
    const bbox = keyElement.getBoundingClientRect();
    const nextBbox = nextKeyElement.getBoundingClientRect();
    const width = isDiatonic
        ? nextBbox.left - lastX
        : bbox.width;
    console.log(`key ${keyElement.dataset.midi} is ${width}px wide`);
    lastX += width;
}

// eslint-disable-next-line
// @ts-ignore
window.renderer = renderer;
