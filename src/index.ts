import Renderer from './renderer';

const container = document.getElementById('root');
if (!container) {
    throw new Error('No container');
}

const renderer = new Renderer({
    container,
    onClick: console.log,
});

window.renderer = renderer;

(async () => {
    while (true) {
        renderer.addKeysLeft(10);
        renderer.addKeysRight(10);
        renderer.setMidiView(60, 72);
        await delay(500);
    }
})();

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}