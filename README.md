## piano-core
Piano-core is a dynamic and performant piano renderer which is currently early in development. It utilizes virtualization to only render keys into the DOM at the moment they will be presented to screen. This allows pianos to expand to the full 88 keys on demand without needing to always have 88 keys in the DOM. 

It's API is very simple and supports configurable animation durations and setting midi range.

### demo
https://piano-core.netlify.app/

### example usage

The following example will render a piano inside of a div with id `root`. It will start by display the midi range 60-71 and after a second will begin animating to midi range 36-60 for 2s.
```
const renderer = new Renderer({
    container: document.getElementById('root'),
    onKeyClick: midi => console.log('key clicked:', midi),
    animationDuration: 2000,
    midiStart: 60 // C4
    midiEnd: 71   // B4
});

setTimeout(() => renderer.setRange(36, 60), 1000);
```
