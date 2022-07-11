export const PIANO_KEY_CLASS = 'c-piano-key';
export const PIANO_KEY_DIATONIC_CLASS = PIANO_KEY_CLASS + '-diatonic';
export const PIANO_KEY_ACCIDENTAL_CLASS = PIANO_KEY_CLASS + '-accidental';
export const PIANO_KEY_LABEL_CLASS = PIANO_KEY_CLASS + '-label';

export type MidiHandler = (midi: number) => void;
