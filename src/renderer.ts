import {
    getClosestDiatonicLeft,
    getClosestDiatonicRight,
    isDiatonic
} from './TheoryUtils';

const DEFAULT_MIDI_START = 49;
const DEFAULT_MIDI_END = 72;

type ClickHandler = (midi: number) => void;

type Options = {
    container: HTMLElement;
    midiStart?: number,
    midiEnd?: number;
    onClick?: ClickHandler;
};

export default class Renderer {
    private container: HTMLElement;
    private pianoContainer?: HTMLDivElement;
    private keysContainer?: HTMLDivElement;
    private options: Options;
    private midiStart: number;
    private midiEnd: number;

    constructor(options: Options) {
        this.options = options;
        this.container = options.container;
        this.midiStart = getClosestDiatonicLeft(options.midiStart ?? DEFAULT_MIDI_START);
        this.midiEnd = getClosestDiatonicRight(options.midiEnd ?? DEFAULT_MIDI_END);
        this.constuct();
    }

    onClick(event: MouseEvent) {
        const keyElement = event.target as HTMLDivElement;
        const {midi} = keyElement.dataset;
        if (midi === undefined) {
            return;
        }

        if (this.options.onClick) {
            this.options.onClick(Number(midi));
        }
    }

    setMidiStart(midi: number) {
        this.midiStart = getClosestDiatonicLeft(midi);
    }

    setMidiEnd(midi: number) {
        this.midiEnd = getClosestDiatonicRight(midi)
    }

    scrollToX(x: number) {
        if (!this.pianoContainer) {
            throw new Error('Cannot scroll before piano has been constructed');
        }

        this.pianoContainer.scrollTo(x, 0);
    }

    setWidth(width: string) {
        if (!this.keysContainer) {
            throw new Error('Cannot set width before piano has been constructed');
        }
        this.keysContainer.style.width = width;
    }

    private constuct() {
        this.pianoContainer = document.createElement('div');
        this.pianoContainer.onclick = this.onClick.bind(this);
        this.pianoContainer.classList.add('piano-container');
        this.keysContainer = document.createElement('div');
        this.keysContainer.classList.add('piano-keys-container');
        const keysFragment = document.createDocumentFragment();
        for (let midi = this.midiStart; midi < this.midiEnd; midi++) {
            if (isDiatonic(midi)) {
                const keyElement = this.createKeyElementDiatonic(midi);
                keysFragment.append(keyElement);
                continue;
            }

            // We need to append accidental keys into their respective diatonic key
            const diatonicKey = keysFragment.lastChild as HTMLDivElement;
            const keyElement = this.createKeyElementAccidental(midi);
            diatonicKey.append(keyElement);
        }

        this.keysContainer.append(keysFragment);
        this.pianoContainer.appendChild(this.keysContainer);
        this.container.append(this.pianoContainer);
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
}
