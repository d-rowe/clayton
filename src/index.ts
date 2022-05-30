import Renderer from './Renderer';
import {delay} from './utils';
import * as TheoryUtils from './TheoryUtils';

const container = document.getElementById('root');
if (!container) {
    throw new Error('No container');
}

const renderer = new Renderer({
    container,
    onKeyClick: console.log,
    animationDuration: 2000,
});

// eslint-disable-next-line
// @ts-ignore
window.renderer = renderer;
// eslint-disable-next-line
// @ts-ignore
window.utils = TheoryUtils;

const ranges = [
    [48, 72],
    [60, 72],
    [0, 12],
    [12, 48],
];

(async () => {
    while (true) {
        for (const range of ranges) {
            const [start, end] = range;
            await renderer.setRange(start, end);
            await delay(1000);
        }
    }
})();