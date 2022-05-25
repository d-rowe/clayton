import Renderer from './renderer';

const container = document.getElementById('root');
if (!container) {
    throw new Error('No container');
}

const renderer = new Renderer({
    container,
    onClick: console.log,
});


setInterval(() => {
    renderer.addKeysLeft(1);
    renderer.addKeysRight(1);
}, 2000);
