## Piano-core
Piano-core is a javascript piano renderer.

A few of it's core features are:
- Framework agnostic: written in vanilla js
- Accessible: screen reader support out of the box
- Animations: animate note changes as well as keyboard range changes
- Performant: utilizes virtualization to minimize the amount of DOM elements used

It's API supports animation duration configuration and changing midi range.

### Demo
https://piano-core.netlify.app/

### Example usage

The following example will render a piano inside of a div with id `root`. It will start by display the midi range 60-71 and after a second will begin animating to midi range 36-60 for 2s.
```
const piano = new PianoCore({
    container: 'root',
    onKeyClick: midi => console.log('key clicked:', midi),
    animationDuration: 2000,
    midiRange: [60, 71]
});

setTimeout(() => piano.setRange(36, 60), 1000);
```
