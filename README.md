## Clayton
Clayton is a lightweight javascript piano renderer.

A few of it's core features are:
- Framework agnostic: written in vanilla js
- Lightweight: zero-dependency and <4kb g-zipped
- Touchscreen support: full multi-touch support for playing chords
- Accessible: screen reader support out of the box
- Animations: animate note changes as well as keyboard range changes
- Performant: utilizes virtualization to minimize the amount of DOM elements rendered

### Demo
https://clayton-piano.netlify.app/

### Installation
Install npm package with
```
npm install clayton-piano
```

### Example usage

The following example will render a piano inside of a div with id `root`. It will start by display the midi range 60-71 and after a second will begin animating to midi range 36-60 for 500ms.
```
import Piano from 'clayton-piano';

const piano = new Piano({
    container: 'root',
    onKeyDown: midi => console.log('key down:', midi),
    onKeyUp: midi => console.log('key up:', midi),
    midiRange: [60, 71]
});

setTimeout(() => piano.setRange(36, 60), 1000);
```
