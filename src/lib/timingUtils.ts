export async function deferredAnimationFrame(): Promise<void> {
    await animationFrame();
    await defer();
}

export function transitionEnd(element: HTMLElement): Promise<void> {
    return new Promise(resolve => {
        element.ontransitionend = () => resolve();
    });
}

function defer(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 0));
}

function animationFrame(): Promise<void> {
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
}
