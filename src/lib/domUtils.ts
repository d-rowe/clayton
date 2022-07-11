export function setAttributes(element: HTMLElement, attributes: Record<string, string>): void {
    Object.entries(attributes).forEach(([key, val]) => {
        element.setAttribute(key, val);
    });
}

export function getMidiFromKeyElement(keyElement: HTMLDivElement): number | null {
    const midi = Number(keyElement.dataset.midi);
    return isFinite(midi) ? midi : null;
}
