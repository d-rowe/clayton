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
    midiRange: [60, 71],
    animationDuration: 1000,
});

console.log(renderer);
