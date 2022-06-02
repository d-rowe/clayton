export function delay(ms = 20): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
