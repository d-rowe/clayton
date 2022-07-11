import { setAttributes, getMidiFromKeyElement } from './lib/domUtils';
import createPanZoom from './lib/createPanZoom';
import {
    DIATONIC_STEP,
    getClosestDiatonicLeft,
    getClosestDiatonicRight,
    getDiatonicRange,
    getDiatonicRangeInclusive,
    getMidiDiatonicDistAway,
    isDiatonic
} from './lib/theoryUtils';
import {
    deferredAnimationFrame,
    transitionEnd
} from './lib/timingUtils';
import KeyboardController from './KeyboardController';
import {
    PIANO_KEY_ACCIDENTAL_CLASS,
    PIANO_KEY_CLASS,
    PIANO_KEY_DIATONIC_CLASS,
    PIANO_KEY_LABEL_CLASS,
} from './constants';
import { ensureStyleIsApplied } from './styles'
import PianoController from './PianoController';

import type { KeyLabels } from './lib/keyLabels';
import type { MidiHandler } from './constants';

const DEFAULT_MIDI_START = 48;
const DEFAULT_MIDI_END = 84;
const DEFAULT_MIDI_LIMIT_START = 2;
const DEFAULT_MIDI_LIMIT_END = 84;
const DEFAULT_ANIMATION_DURATION_MS = 250;

type MidiRange = [start: number, end: number];

type Options = {
    container: HTMLElement | string;
    midiRange?: MidiRange,
    midiRangeLimit?: MidiRange,
    onNoteOn?: MidiHandler,
    onNoteOff?: MidiHandler,
    keyLabels?: KeyLabels,
};


export default class Renderer {
    private container: HTMLElement;
    private pianoContainer: HTMLDivElement;
    private keysContainer: HTMLDivElement;
    private options: Options;
    private pianoController: PianoController;
    private animationDuration: number;
    private midiStart: number;
    private midiEnd: number;
    private midiLimitStart: number;
    private midiLimitEnd: number;
    private midiViewStart: number;
    private midiViewEnd: number;
    private isRangeAnimationInProgress = false;
    private pendingMidiRange: MidiRange | null = null;
    private initPanZoomRange: MidiRange | null = null;
    private keyReferenceByMidi = new Map<number, HTMLDivElement>();

    constructor(options: Options) {
        ensureStyleIsApplied();
        this.options = options;
        this.animationDuration = DEFAULT_ANIMATION_DURATION_MS;
        const [midiStart, midiEnd] = options.midiRange || [];
        this.midiStart = getClosestDiatonicLeft(midiStart ?? DEFAULT_MIDI_START);
        this.midiEnd = getClosestDiatonicRight(midiEnd ?? DEFAULT_MIDI_END);
        const [midiLimitStart, midiLimitEnd] = options.midiRangeLimit || [];
        this.midiLimitStart = getClosestDiatonicLeft(midiLimitStart ?? DEFAULT_MIDI_LIMIT_START);
        this.midiLimitEnd = getClosestDiatonicRight(midiLimitEnd ?? DEFAULT_MIDI_LIMIT_END);
        this.midiViewStart = this.midiStart;
        this.midiViewEnd = this.midiEnd;

        const { container } = options;
        if (typeof container === 'string') {
            const containerElement = document.getElementById(container);
            if (!containerElement) {
                throw new Error(`Cannot find container element with id ${container}`);
            }
            this.container = containerElement;
        } else {
            this.container = options.container as HTMLElement;
        }

        this.pianoContainer = document.createElement('div');
        this.pianoContainer.onwheel = createPanZoom({
            onPanX: this.onPanX.bind(this),
            onZoom: this.onZoom.bind(this),
            onStart: this.onPanZoomStart.bind(this),
            onEnd: this.onPanZoomEnd.bind(this),
        });
        this.pianoContainer.classList.add('c-piano-container');
        this.keysContainer = document.createElement('div');
        this.keysContainer.classList.add('c-piano-keys-container');
        const keysFragment = this.constructKeysFragment(this.midiStart, this.midiEnd);
        this.keysContainer.append(keysFragment);
        this.pianoContainer.appendChild(this.keysContainer);
        this.container.append(this.pianoContainer);
        KeyboardController.init(this.pianoContainer);

        this.pianoController = new PianoController(this.pianoContainer, {
            onNoteDown: midi => {
                this.noteOn(midi);
                this.options.onNoteOn?.(midi);
            },
            onNoteUp: midi => {
                this.noteOff(midi);
                this.options.onNoteOff?.(midi);
            }
        });
    }

    noteOn(midi: number): void {
        const keyElement = this.keyReferenceByMidi.get(midi);
        if (!keyElement) {
            return;
        }

        keyElement.classList.add('active')
    }

    noteOff(midi: number): void {
        const keyElement = this.keyReferenceByMidi.get(midi);
        if (!keyElement) {
            return;
        }

        keyElement.classList.remove('active')
    }

    setKeyColor(midi: number, color: string): void {
        const keyElement = this.keyReferenceByMidi.get(midi);
        if (!keyElement) {
            return;
        }
        keyElement.style.backgroundColor = color;
    }

    unsetKeyColor(midi: number): void {
        const keyElement = this.keyReferenceByMidi.get(midi);
        if (!keyElement) {
            return;
        }
        keyElement.style.backgroundColor = '';
    }

    async setMidiRange(midiRange: MidiRange): Promise<void> {
        if (this.isRangeAnimationInProgress) {
            this.pendingMidiRange = midiRange;
            return;
        }

        this.isRangeAnimationInProgress = true;
        const [midiStart, midiEnd] = midiRange;
        const normalizedMidiStart = getClosestDiatonicLeft(midiStart);
        const normalizedMidiEnd = getClosestDiatonicRight(midiEnd);
        this.renderKeys(midiRange);
        await deferredAnimationFrame();
        await this.enableAnimation(this.animationDuration);
        this.setMidiViewRange([normalizedMidiStart, normalizedMidiEnd]);
        await transitionEnd(this.keysContainer);
        await this.disableAnimation();
        this.clearInvisibleKeys();

        this.isRangeAnimationInProgress = false;
        if (this.pendingMidiRange) {
            this.setMidiRange(this.pendingMidiRange);
            this.pendingMidiRange = null;
        }
    }

    getMidiRange(): MidiRange {
        return [this.midiStart, this.midiEnd];
    }

    setAnimationDuration(ms: number): void {
        this.animationDuration = ms;
    }

    destroy(): void {
        this.pianoController.destroy();
    }

    private renderKeys(midiRange: MidiRange) {
        const [midiStart, midiEnd] = midiRange;
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

        this.setMidiViewRange([initialMidiViewStart, initialMidiViewEnd]);
    }

    // TODO: move to PianoController
    private async onPanZoomStart() {
        if (this.isRangeAnimationInProgress) {
            return;
        }
        this.initPanZoomRange = this.getMidiRange();
        await this.disableAnimation();
        this.renderKeys([this.midiLimitStart, this.midiLimitEnd]);
        await deferredAnimationFrame();
        await this.enableAnimation(100);
    }

    // TODO: move to PianoController
    private async onPanZoomEnd() {
        this.initPanZoomRange = null;
        await this.disableAnimation();
        this.clearInvisibleKeys();
    }

    // TODO: move to PianoController
    private async onPanX(panX: number): Promise<void> {
        if (this.isRangeAnimationInProgress) {
            return;
        }

        const diatonicDelta = Math.round(panX / -20);
        if (!this.initPanZoomRange) {
            throw new Error('Cannot panzoom before panzoom initialization');
        }
        const [initStart, initEnd] = this.initPanZoomRange;
        this.setMidiViewRange([
            getMidiDiatonicDistAway(initStart, diatonicDelta),
            getMidiDiatonicDistAway(initEnd, diatonicDelta),
        ]);
    }

    // TODO: move to PianoController
    private onZoom(scale: number): void {
        if (this.isRangeAnimationInProgress) {
            return;
        }

        const diatonicDelta = Math.round(-scale);
        if (!this.initPanZoomRange) {
            throw new Error('Cannot panzoom before panzoom initialization');
        }
        const [initStart, initEnd] = this.initPanZoomRange;
        this.setMidiViewRange([
            getMidiDiatonicDistAway(initStart, -diatonicDelta),
            getMidiDiatonicDistAway(initEnd, diatonicDelta),
        ]);
    }

    private translateX(translateX: number) {
        this.keysContainer.style.transform = `translateX(${translateX}%)`;
    }

    private setMidiViewRange(midiRange: MidiRange) {
        const [midiStart, midiEnd] = midiRange;
        if (midiStart < this.midiLimitStart || midiEnd > this.midiLimitEnd) {
            return;
        }
        const start = getClosestDiatonicLeft(midiStart);
        const end = getClosestDiatonicRight(midiEnd);
        const viewableDiatonicRange = getDiatonicRangeInclusive(start, end);
        const totalDiatonicRange = getDiatonicRangeInclusive(this.midiStart, this.midiEnd);
        this.setWidth((totalDiatonicRange / viewableDiatonicRange) * 100);
        const leftDiatonicDiff = getDiatonicRange(this.midiStart, start);
        if (leftDiatonicDiff >= 0) {
            this.translateX((leftDiatonicDiff / totalDiatonicRange) * -100);
        }
        this.midiViewStart = start;
        this.midiViewEnd = end;
    }

    private addKeysLeft(keyCount: number) {
        const start = getClosestDiatonicLeft(this.midiStart - keyCount);
        const end = this.midiStart - DIATONIC_STEP;
        const keysFragment = this.constructKeysFragment(start, end);
        this.keysContainer.prepend(keysFragment);
        this.midiStart = start;
    }

    private addKeysRight(keyCount: number) {
        const start = this.midiEnd + DIATONIC_STEP;
        const end = getClosestDiatonicRight(this.midiEnd + keyCount);
        const keysFragment = this.constructKeysFragment(start, end);
        this.keysContainer.append(keysFragment);
        this.midiEnd = end;
    }

    private clearInvisibleKeys() {
        // TODO: we don't really need to check all keys, we can use left/right pointers
        const keyElements = this.keysContainer.querySelectorAll(`.${PIANO_KEY_CLASS}`) as NodeListOf<HTMLDivElement>;
        keyElements.forEach(key => {
            const midi = getMidiFromKeyElement(key);
            if (midi === null) {
                return;
            }
            const isEndingAccidental = midi === this.midiViewEnd + 1 && !isDiatonic(midi);
            if ((midi > this.midiViewEnd || midi < this.midiViewStart) && !isEndingAccidental) {
                key.remove();
            }
        });

        this.midiStart = this.midiViewStart;
        this.midiEnd = this.midiViewEnd;
        this.setMidiViewRange([this.midiStart, this.midiEnd]);
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
        setAttributes(keyElement, {
            role: 'button',
            tabindex: '0',
            'aria-description': 'piano key',
        });
        const label = this.options.keyLabels?.[midi];
        if (label) {
            const labelElement = document.createElement('label');
            labelElement.classList.add(PIANO_KEY_LABEL_CLASS);
            const labelId = 'key-label-' + midi;
            labelElement.id = labelId;
            keyElement.setAttribute('aria-labelledby', labelId);
            labelElement.innerText = label;
            keyElement.appendChild(labelElement);
        }
        keyElement.classList.add(PIANO_KEY_CLASS);
        keyElement.dataset.midi = midi.toString();
        this.keyReferenceByMidi.set(midi, keyElement);
        return keyElement;
    }

    private createKeyElementDiatonic(midi: number) {
        const keyElement = this.createKeyElementGeneric(midi);
        keyElement.classList.add(PIANO_KEY_DIATONIC_CLASS);
        return keyElement;
    }

    private createKeyElementAccidental(midi: number) {
        const keyElement = this.createKeyElementGeneric(midi);
        keyElement.classList.add(PIANO_KEY_ACCIDENTAL_CLASS);
        return keyElement;
    }

    private setWidth(width: number) {
        this.keysContainer.style.width = width + '%';
    }

    private async enableAnimation(duration: number) {
        this.keysContainer.style.transitionDuration = duration + 'ms';
        await deferredAnimationFrame();
    }

    private async disableAnimation() {
        this.keysContainer.style.transitionDuration = '';
        await deferredAnimationFrame();
    }
}
