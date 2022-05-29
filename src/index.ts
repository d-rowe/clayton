import Renderer from './renderer';

const container = document.getElementById('root');
if (!container) {
    throw new Error('No container');
}

const renderer = new Renderer({
    container,
    onKeyClick: console.log,
});

// eslint-disable-next-line
// @ts-ignore
window.renderer = renderer;

renderer.setView(60, 72);

// (async () => {
//     while (true) {
//         renderer.setView(60, 72);
//         await delay(1000);
//         renderer.setView(48, 72);
//         await delay(1000);
//     }
// })();

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}