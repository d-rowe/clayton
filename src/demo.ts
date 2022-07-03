import Renderer from './Renderer';
import {createDefaultLabels} from './utils/keyLabels';

const container = document.getElementById('root');
if (!container) {
    throw new Error('No container');
}


const renderer = new Renderer({
    container,
    onKeyUp,
    onKeyDown,
    keyLabels: createDefaultLabels(),
    midiRange: [60, 71],
});

function onKeyDown(midi: number) {
    renderer.setKeyColor(midi, 'red');
}

function onKeyUp(midi: number) {
    renderer.unsetKeyColor(midi);
}

// eslint-disable-next-line
// @ts-ignore
window.renderer = renderer;
