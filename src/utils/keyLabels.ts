import { isDiatonic } from "./theoryUtils";

const notes = 'CDEFGAB';

export type KeyLabels = Record<string, string>;

export function createDefaultLabels(): KeyLabels {
    const keyLabels: KeyLabels = {};
    let currentNoteIndex = 0;
    let currentNoteLabel = '';
    for (let midi = 2; midi <= 84; midi++) {
        const octave = Math.floor(midi / 12) - 1;
        if (isDiatonic(midi)) {
            if (currentNoteIndex >= notes.length - 1) {
                currentNoteIndex = 0;
            } else {
                currentNoteIndex++;
            }
            currentNoteLabel = notes.charAt(currentNoteIndex);
            keyLabels[midi] = currentNoteLabel + octave;
        }
    }
    return keyLabels;
}
