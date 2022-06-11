## Piano-core
Piano-core is a lightweight javascript piano renderer.

A few of it's core features are:
- Framework agnostic: written in vanilla js
- Accessible: screen reader support out of the box
- Animations: animate note changes as well as keyboard range changes
- Performant: utilizes virtualization to minimize the amount of DOM elements used

It's API supports animation duration configuration and changing midi range.

### Demo
https://piano-core.netlify.app/

### Installation
Install npm package with
```
npm install piano-core
```

You'll also need to include the piano stylesheet. You can do so by adding the following to your HTML
```
<link rel="stylesheet" href="https://unpkg.com/piano-core@0.1.7/dist/piano.css">
```

### Example usage

The following example will render a piano inside of a div with id `root`. It will start by display the midi range 60-71 and after a second will begin animating to midi range 36-60 for 2s.
```
import PianoCore from 'piano-core';

const piano = new PianoCore({
    container: 'root',
    onKeyClick: midi => console.log('key clicked:', midi),
    animationDuration: 2000,
    midiRange: [60, 71]
});

setTimeout(() => piano.setRange(36, 60), 1000);
```
