import Renderer from './Renderer';
import {delay} from './utils/promiseUtils';

const container = document.getElementById('root');
if (!container) {
    throw new Error('No container');
}

const renderer = new Renderer({
    container,
    onKeyClick: console.log,
    animationDuration: 2000,
});

const ranges = [
    [48, 84],
    [60, 72],
    [36, 60],
    [24, 36],
];

(async () => {
    while (true) {
        for (const range of ranges) {
            const [start, end] = range;
            await renderer.setRange(start, end);
            await delay(250);
        }
    }
})();