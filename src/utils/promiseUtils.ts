export function delay(ms = 0): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function animationFrame(): Promise<void> {
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

export async function deferredAnimationFrame(): Promise<void> {
    await animationFrame();
    await delay();
}
