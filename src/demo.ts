import Renderer from './Renderer';
import {createDefaultLabels} from './utils/keyLabels';

const container = document.getElementById('root');
if (!container) {
    throw new Error('No container');
}


const renderer = new Renderer({
    container,
    onKeyUp: midi => console.log('Key up', midi),
    onKeyDown: midi => console.log('Key down', midi),
    keyLabels: createDefaultLabels(),
    midiRange: [60, 71],
    animationDuration: 1000,
});

// eslint-disable-next-line
// @ts-ignore
window.renderer = renderer;
