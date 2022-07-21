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

// eslint-disable-next-line
// @ts-ignore
window.renderer = renderer;
