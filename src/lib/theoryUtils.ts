const DIATONIC_PITCH_CLASSES = new Set([0, 2, 4, 5, 7, 9, 11]);
const SIMPLE_ACCIDENTAL_NAMES = new Map<number, string>([
    [1, 'cs'],
    [3, 'ds'],
    [6, 'fs'],
    [8, 'gs'],
    [10, 'as'],
]);
export const DIATONIC_STEP = 2;

export function isDiatonic(midi: number): boolean {
    return DIATONIC_PITCH_CLASSES.has(midi % 12);
}

export function getClosestDiatonicLeft(midi: number): number {
    return getClosestDiatonic(midi, -1);
}

export function getClosestDiatonicRight(midi: number): number {
    return getClosestDiatonic(midi, 1);
}

export function getDiatonicRange(midiStart: number, midiEnd: number): number {
    let range = 0;
    const start = getClosestDiatonicLeft(midiStart);
    const end = getClosestDiatonicRight(midiEnd);
    for (let midi = start; midi < end; midi++) {
        if (isDiatonic(midi)) {
            range++;
        }
    }
    return range;
}

export function getDiatonicRangeInclusive(midiStart: number, midiEnd: number): number {
    // include start note
    return getDiatonicRange(midiStart, midiEnd) + 1;
}

export function getMidiDiatonicDistAway(diatonic: number, diatonicDist: number): number {
    if (diatonicDist === 0) {
        return diatonic;
    }

    const diatonicDistAbs = Math.abs(diatonicDist);
    const direction = diatonicDist / diatonicDistAbs;
    let currentMidi = diatonic;
    let currentDiatonicDistAbs = 0;

    while (currentDiatonicDistAbs < diatonicDistAbs) {
        currentMidi += direction;
        if (isDiatonic(currentMidi)) {
            currentDiatonicDistAbs++;
        }
    }

    return currentMidi;
}

export function getAccidentalName(midi: number): string | undefined {
    return SIMPLE_ACCIDENTAL_NAMES.get(midi % 12);
}

function getClosestDiatonic(midi: number, direction: 1 | -1): number {
    if (isDiatonic(midi)) {
        return midi;
    }
    return getClosestDiatonic(midi + direction, direction);
}
