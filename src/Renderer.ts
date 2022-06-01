import {
    DIATONIC_STEP,
    getClosestDiatonicLeft,
    getClosestDiatonicRight,
    getDiatonicRange,
    getDiatonicRangeInclusive,
    isDiatonic
} from './TheoryUtils';
import { delay } from './utils';

const DEFAULT_MIDI_START = 48;
const DEFAULT_MIDI_END = 84;
const DEFAULT_ANIMATION_DURATION_MS = 200;

type ClickHandler = (midi: number) => void;

type Options = {
    container: HTMLElement;
    midiStart?: number,
    midiEnd?: number;
    onKeyClick?: ClickHandler;
    animationDuration?: number,
};

export default class Renderer {
    private container: HTMLElement;
    private pianoContainer: HTMLDivElement;
    private keysContainer: HTMLDivElement;
    private options: Options;
    private animationDuration: number;
    private midiStart: number;
    private midiEnd: number;
    private midiViewStart: number;
    private midiViewEnd: number;

    constructor(options: Options) {
        this.options = options;
        this.container = options.container;
        this.animationDuration = options.animationDuration ?? DEFAULT_ANIMATION_DURATION_MS;
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
        if (!this.options.onKeyClick) {
            return;
        }
        const keyElement = event.target as HTMLDivElement;
        const midi = this.getMidiFromKeyElement(keyElement);
        this.options.onKeyClick(midi);
    }

    async setRange(midiStart: number, midiEnd: number) {
        const normalizedMidiStart = getClosestDiatonicLeft(midiStart);
        const normalizedMidiEnd = getClosestDiatonicRight(midiEnd);
        const initialMidiViewStart = this.midiViewStart;
        const initialMidiViewEnd = this.midiViewEnd;
        const leftKeyCount = this.midiStart - normalizedMidiStart;
        const rightKeyCount = normalizedMidiEnd - this.midiEnd;
        if (leftKeyCount > 0) {
            this.addKeysLeft(leftKeyCount);
        }
        if (rightKeyCount > 0) {
            this.addKeysRight(rightKeyCount);
        }

        this.setView(initialMidiViewStart, initialMidiViewEnd);
        await delay(0);
        await this.enableAnimation();
        this.setView(normalizedMidiStart, normalizedMidiEnd);
        await delay(this.animationDuration);
        await this.disableAnimation();
        this.clearInvisibleKeys();
    }

    setView(midiStart: number, midiEnd: number) {
        const start = getClosestDiatonicLeft(midiStart);
        const end = getClosestDiatonicRight(midiEnd);
        const viewableDiatonicRange = getDiatonicRangeInclusive(start, end);
        const totalDiatonicRange = getDiatonicRangeInclusive(this.midiStart, this.midiEnd);
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
        const end = this.midiStart - DIATONIC_STEP;
        const keysFragment = this.constructKeysFragment(start, end);
        this.keysContainer.prepend(keysFragment);
        this.midiStart = start;
    }

    addKeysRight(keyCount: number) {
        const start = this.midiEnd + DIATONIC_STEP;
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

    clearInvisibleKeys() {
        // TODO: we don't really need to check all keys, we can use left/right pointers
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
        const isNextDiatonic = isDiatonic(midiDiatonicEnd + 1);
        const trailingEnd = isNextDiatonic
            ? midiDiatonicEnd
            : midiDiatonicEnd + 1;

        for (let midi = midiDiatonicStart; midi <= trailingEnd; midi++) {
            if (isDiatonic(midi)) {
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

    private setWidth(width: string) {
        this.keysContainer.style.width = width;
    }

    private getMidiFromKeyElement(keyElement: HTMLDivElement): number {
        return Number(keyElement.dataset.midi);
    }

    private async enableAnimation() {
        const durationText = this.animationDuration + 'ms';
        const widthTransition = `width ${durationText} ease-in-out`;
        const transformTransition = `transform ${durationText} ease-in-out`;
        this.keysContainer.style.transition = `${widthTransition}, ${transformTransition}`;
        await delay(0);
    }

    private async disableAnimation() {
        this.keysContainer.style.transition = '';
        await delay(0)
    }
}
