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
        await delay(1000);
        renderer.setRange(48, 72);
        renderer.setMidiView(48, 60);
        await delay(1000);
        renderer.setRange(36, 72);
        renderer.setMidiView(48, 60);
    }
})();

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}