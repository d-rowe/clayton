import Renderer from "./renderer";

const container = document.getElementById('root');
if (!container) {
    throw new Error('No container');
}

const renderer = new Renderer({
    container,
    onClick: console.log,
});


let zoomedIn = false;
setInterval(() => {
    const width = zoomedIn ? '100%' : '200%';
    renderer.setWidth(width);
    zoomedIn = !zoomedIn;
}, 1000);
