const styles = `
.piano-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    cursor: pointer;
}

.piano-keys-container {
    display: flex;
    height: 100%;
    transition-property: width, transform;
    transition-timing-function: ease-in-out;
}

.piano-key {
    display: flex;
    flex-grow: 1;
    border-radius: 5px;
    justify-content: center;
    align-items: flex-end;
}

.piano-key.active {
    background-color: rgb(76, 157, 255);
}

.piano-key-diatonic {
    border: 1px solid #3f3f3f;
    background-color: white;
    position: relative;
    color: #424242;
    box-shadow:
        -1px 0 0 rgb(255 255 255 / 80%) inset,
        0 0 5px #ccc inset,
        0 0 3px rgb(0 0 0 / 20%);
}

.piano-key-diatonic.active {
    box-shadow:
        2px 0 3px rgba(0, 0, 0, 0.2) inset,
        -5px 5px 20px rgba(0, 0, 0, 0.2) inset,
        0 0 3px rgba(0, 0, 0, 0.4);
  }

.piano-key-accidental {
    position: absolute;
    top: -1px;
    left: 70%;
    width: 60%;
    height: 55%;
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

.piano-key-accidental.active {
    box-shadow:
        -1px -1px 2px rgba(255, 255, 255, 0.2) inset,
        0 -2px 2px 3px rgba(0, 0, 0, 0.6) inset,
        0 1px 2px rgba(0, 0, 0, 0.5);
}

.piano-key-label {
    margin-bottom: 16px;
    font-size: large;
    font-family: sans-serif;
    font-size: min(4vw, 1rem);
    position: absolute;
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
