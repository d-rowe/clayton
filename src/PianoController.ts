import type { MidiHandler } from './constants';
import { getMidiFromKeyElement } from './lib/domUtils';

type Options = {
    onKeyDown: MidiHandler,
    onKeyUp: MidiHandler,
};

export default class PianoController {
    declare private container: HTMLDivElement;
    declare private options: Options;
    private isMouseDown = false;
    private activeMouseMidi: number | null = null;
    private touchMidiByIdentifier = new Map<number, number>();

    constructor(container: HTMLDivElement, options: Options) {
        this.container = container;
        this.options = options;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);

        this.container.addEventListener('mousedown', this.onMouseDown);
        this.container.addEventListener('mousemove', this.onMouseMove);
        this.container.addEventListener('mouseup', this.onMouseUp);
        this.container.addEventListener('mouseleave', this.onMouseLeave);
        this.container.addEventListener('touchstart', this.onTouchStart);
        this.container.addEventListener('touchmove', this.onTouchMove);
        this.container.addEventListener('touchend', this.onTouchEnd);
    }

    public destroy(): void {
        this.container.removeEventListener('mousedown', this.onMouseDown);
        this.container.removeEventListener('mousemove', this.onMouseMove);
        this.container.removeEventListener('mouseup', this.onMouseUp);
        this.container.removeEventListener('mouseleave', this.onMouseLeave);
        this.container.removeEventListener('touchstart', this.onTouchStart);
        this.container.removeEventListener('touchmove', this.onTouchMove);
        this.container.removeEventListener('touchend', this.onTouchEnd);
    }

    private onMouseDown(e: MouseEvent): void {
        e.preventDefault();
        this.isMouseDown = true;
        const keyElement = e.target as HTMLDivElement;
        this.activeMouseMidi = getMidiFromKeyElement(keyElement);

        if (this.activeMouseMidi !== null) {
            this.options.onKeyDown(this.activeMouseMidi);
        }
    }

    private onMouseMove(e: MouseEvent): void {
        if (!this.isMouseDown) {
            return;
        }

        e.preventDefault();
        const keyElement = e.target as HTMLDivElement;
        const midi = getMidiFromKeyElement(keyElement);

        if (this.activeMouseMidi === midi) {
            return;
        }

        if (this.activeMouseMidi !== null) {
            this.options.onKeyUp(this.activeMouseMidi);
        }

        if (midi !== null) {
            this.activeMouseMidi = midi;
            this.options.onKeyDown(midi);
        }
    }

    private onMouseUp(): void {
        this.onMouseLeave();
        this.isMouseDown = false;
    }

    private onMouseLeave(): void {
        if (this.activeMouseMidi !== null) {
            this.options.onKeyUp(this.activeMouseMidi);
        }

        this.activeMouseMidi = null;
    }

    private onTouchStart(e: TouchEvent): void {
        e.preventDefault();
        const touch = e.targetTouches[0];
        const keyElement = touch.target as HTMLDivElement;
        const midi = getMidiFromKeyElement(keyElement);
        if (midi === null) {
            return;
        }

        this.touchMidiByIdentifier.set(touch.identifier, midi);
        this.options.onKeyDown(midi);
    }

    private onTouchMove(e: TouchEvent): void {
        e.preventDefault();

        const { changedTouches } = e;
        for (let touchIndex = 0; touchIndex < changedTouches.length; touchIndex++) {
            const touch = changedTouches[touchIndex];
            const lastMidi = this.touchMidiByIdentifier.get(touch.identifier);
            const keyElement = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLDivElement | null;
            if (!keyElement) {
                if (lastMidi !== undefined) {
                    this.touchMidiByIdentifier.delete(touch.identifier);
                    this.options.onKeyUp(lastMidi);
                }
                continue;
            }
            const midi = getMidiFromKeyElement(keyElement);
            if (midi === lastMidi) {
                continue;
            }

            if (lastMidi !== undefined) {
                this.options.onKeyUp(lastMidi);
            }

            if (midi === null) {
                this.touchMidiByIdentifier.delete(touch.identifier);
            } else {
                this.touchMidiByIdentifier.set(touch.identifier, midi);
                this.options.onKeyDown(midi);
            }
        }
    }

    private onTouchEnd(e: TouchEvent): void {
        const {identifier} = e.changedTouches[0];
        const midi = this.touchMidiByIdentifier.get(identifier);

        if (midi !== undefined) {
            this.options.onKeyUp(midi);
            this.touchMidiByIdentifier.delete(identifier);
        }
    }
}
