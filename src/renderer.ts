import {
    getClosestDiatonicLeft,
    getClosestDiatonicRight,
    getDiatonicRange,
    isDiatonic
} from './TheoryUtils';

const DEFAULT_MIDI_START = 48;
const DEFAULT_MIDI_END = 84;
const WIDTH_TRANSITION_STYLE = 'width 200ms linear';
const TRANSFORM_TRANSITION_STYLE = 'transform 200ms linear';

type ClickHandler = (midi: number) => void;

type Options = {
    container: HTMLElement;
    midiStart?: number,
    midiEnd?: number;
    onClick?: ClickHandler;
};

export default class Renderer {
    private container: HTMLElement;
    private pianoContainer: HTMLDivElement;
    private keysContainer: HTMLDivElement;
    private options: Options;
    private midiStart: number;
    private midiEnd: number;
    private midiViewStart: number;
    private midiViewEnd: number;

    constructor(options: Options) {
        this.options = options;
        this.container = options.container;
        this.midiStart = getClosestDiatonicLeft(options.midiStart ?? DEFAULT_MIDI_START);
        this.midiEnd = getClosestDiatonicRight(options.midiEnd ?? DEFAULT_MIDI_END);
        this.midiViewStart = this.midiStart;
        this.midiViewEnd = this.midiEnd;

        this.pianoContainer = document.createElement('div');
        this.pianoContainer.onclick = this.onClick.bind(this);
        this.pianoContainer.classList.add('piano-container');
        this.keysContainer = document.createElement('div');
        this.keysContainer.classList.add('piano-keys-container');
        const keysFragment = this.constructKeysFragment(this.midiStart, this.midiEnd);
        this.keysContainer.append(keysFragment);
        this.pianoContainer.appendChild(this.keysContainer);
        this.container.append(this.pianoContainer);
    }

    onClick(event: MouseEvent) {
        const keyElement = event.target as HTMLDivElement;
        const { midi } = keyElement.dataset;
        if (midi === undefined) {
            return;
        }

        if (this.options.onClick) {
            this.options.onClick(Number(midi));
        }
    }

    setRange(midiStart: number, midiEnd: number) {
        const leftKeyCount = this.midiStart - midiStart;
        const rightKeyCount = midiEnd - this.midiEnd;
        if (leftKeyCount > 0) {
            this.addKeysLeft(leftKeyCount);
        }
        if (rightKeyCount > 0) {
            this.addKeysRight(rightKeyCount);
        }

        this.setView(midiStart, midiEnd);
        this.clearInvisibleKeys();
    }

    setView(midiStart: number, midiEnd: number) {
        const start = getClosestDiatonicLeft(midiStart);
        const end = getClosestDiatonicRight(midiEnd);
        const viewableDiatonicRange = getDiatonicRange(start, end);
        const totalDiatonicRange = getDiatonicRange(this.midiStart, this.midiEnd);
        const widthPercentage = (totalDiatonicRange / viewableDiatonicRange) * 100;
        this.setWidth(widthPercentage + '%');
        const leftDiatonicDiff = getDiatonicRange(this.midiStart, start);
        if (leftDiatonicDiff >= 0) {
            const xOffsetPercent = (leftDiatonicDiff / totalDiatonicRange) * -100;
            this.keysContainer.style.transform = `translateX(${xOffsetPercent}%)`;
        }
        this.midiViewStart = start;
        this.midiViewEnd = end;
    }

    addKeysLeft(keyCount: number) {
        const start = getClosestDiatonicLeft(this.midiStart - keyCount);
        const end = this.midiStart - 2;
        const keysFragment = this.constructKeysFragment(start, end);
        this.keysContainer.prepend(keysFragment);
        this.midiStart = start;
    }

    addKeysRight(keyCount: number) {
        const start = this.midiEnd + 2;
        const end = getClosestDiatonicRight(this.midiEnd + keyCount);
        const keysFragment = this.constructKeysFragment(start, end);
        this.keysContainer.append(keysFragment);
        this.midiEnd = end;
    }

    setMidiStart(midi: number) {
        this.midiStart = getClosestDiatonicLeft(midi);
    }

    setMidiEnd(midi: number) {
        this.midiEnd = getClosestDiatonicRight(midi)
    }

    setWidth(width: string) {
        this.keysContainer.style.width = width;
    }

    clearInvisibleKeys() {
        // TODO: we don't really need to check all keys, we can use double pointer
        const keyElements = this.keysContainer.querySelectorAll('.piano-key') as NodeListOf<HTMLDivElement>;
        keyElements.forEach(key => {
            const midi = Number(key.dataset.midi);
            const isTrailingAccidental = midi === this.midiViewEnd + 1 && !isDiatonic(midi);
            if ((midi > this.midiViewEnd || midi < this.midiViewStart) && !isTrailingAccidental) {
                key.remove();
            }
        });

        this.midiStart = this.midiViewStart;
        this.midiEnd = this.midiViewEnd;
        this.setView(this.midiStart, this.midiEnd);
    }

    private constructKeysFragment(midiStart: number, midiEnd: number): DocumentFragment {
        const keysFragment = document.createDocumentFragment();
        let lastDiatonicKeyElement = document.createElement('div');
        const midiDiatonicStart = getClosestDiatonicLeft(midiStart);
        const midiDiatonicEnd = getClosestDiatonicRight(midiEnd);
        const trailingMidiEnd = midiDiatonicEnd + 1;

        for (let midi = midiDiatonicStart; midi <= trailingMidiEnd; midi++) {
            if (isDiatonic(midi) && midi !== trailingMidiEnd) {
                const diatonicKeyElement = this.createKeyElementDiatonic(midi);
                lastDiatonicKeyElement = diatonicKeyElement;
                keysFragment.append(diatonicKeyElement);
                continue;
            }

            // We need to append accidental keys into it's respective diatonic key
            const accidentalKeyElement = this.createKeyElementAccidental(midi);
            lastDiatonicKeyElement.append(accidentalKeyElement);
        }

        return keysFragment;
    }

    private createKeyElementGeneric(midi: number) {
        const keyElement = document.createElement('div');
        keyElement.classList.add('piano-key');
        keyElement.dataset.midi = midi.toString();
        return keyElement;
    }

    private createKeyElementDiatonic(midi: number) {
        const keyElement = this.createKeyElementGeneric(midi);
        keyElement.classList.add('piano-key-diatonic');
        return keyElement;
    }

    private createKeyElementAccidental(midi: number) {
        const keyElement = this.createKeyElementGeneric(midi);
        keyElement.classList.add('piano-key-accidental');
        return keyElement;
    }

    enableAnimation() {
        this.keysContainer.style.transition = WIDTH_TRANSITION_STYLE + ', ' + TRANSFORM_TRANSITION_STYLE;
    }

    disableAnimation() {
        this.keysContainer.style.transition = '';
    }
}
