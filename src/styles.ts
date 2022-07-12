import { PIANO_KEY_ACCIDENTAL_CLASS, PIANO_KEY_CLASS, PIANO_KEY_DIATONIC_CLASS, PIANO_KEY_LABEL_CLASS } from "./constants";

const styles = `
.c-piano-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    cursor: pointer;
}

.c-piano-keys-container {
    display: flex;
    height: 100%;
    transition-property: width, transform;
    transition-timing-function: ease-in-out;
}

.${PIANO_KEY_CLASS} {
    display: flex;
    flex-grow: 1;
    border-radius: 5px;
    justify-content: center;
    align-items: flex-end;
}

.${PIANO_KEY_CLASS}.active {
    background-color: rgb(76, 157, 255);
}

.${PIANO_KEY_DIATONIC_CLASS} {
    border: 1px solid #3f3f3f;
    background-color: white;
    position: relative;
    color: #424242;
    box-shadow:
        -1px 0 0 rgb(255 255 255 / 80%) inset,
        0 0 5px #ccc inset,
        0 0 3px rgb(0 0 0 / 20%);
}

.${PIANO_KEY_DIATONIC_CLASS}.active {
    box-shadow:
        2px 0 3px rgba(0, 0, 0, 0.2) inset,
        -5px 5px 20px rgba(0, 0, 0, 0.2) inset,
        0 0 3px rgba(0, 0, 0, 0.4);
  }

.${PIANO_KEY_ACCIDENTAL_CLASS} {
    position: absolute;
    top: -1px;
    width: 50%;
    height: 63%;
    background-color: #424242;
    color: white;
    z-index: 1;
    border: 2px solid #424242;
    border-top: none;
    box-shadow:
        -1px -1px 2px rgb(255 255 255 / 20%) inset,
        0 -5px 2px 3px rgb(0 0 0 / 60%) inset,
        0 2px 4px rgb(0 0 0 / 50%)
}

.${PIANO_KEY_ACCIDENTAL_CLASS}.active {
    box-shadow:
        -1px -1px 2px rgba(255, 255, 255, 0.2) inset,
        0 -2px 2px 3px rgba(0, 0, 0, 0.6) inset,
        0 1px 2px rgba(0, 0, 0, 0.5);
}

.${PIANO_KEY_LABEL_CLASS} {
    margin-bottom: 16px;
    font-size: large;
    font-family: sans-serif;
    font-size: min(4vw, 1rem);
    position: absolute;
}

.c-piano-key .key-cs {
    left: 64%;
}

.c-piano-key .key-ds {
    left: 83%;
}

.c-piano-key .key-fs {
    left: 62%;
}

.c-piano-key .key-gs {
    left: 73%;
}

.c-piano-key .key-as {
    left: 83%;
}
`;

const styleId = 'clayton-piano-style';

export function ensureStyleIsApplied(): void {
    if (document.getElementById(styleId)) {
        return;
    }

    const styleTag = document.createElement('style');
    styleTag.id = styleId;
    styleTag.textContent = styles;
    document.head.append(styleTag);
}
