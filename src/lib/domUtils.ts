export function setAttributesBatch(element: HTMLElement, attributes: Record<string, string>) {
    Object.entries(attributes).forEach(([key, val]) => {
        element.setAttribute(key, val);
    });
}
