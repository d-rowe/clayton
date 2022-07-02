export default {
    init(container: HTMLDivElement): void {
        container.addEventListener('keydown', onKeyDown);

        const keyActions: Record<string, () => void> = {
            ArrowRight: focusNextKey,
            ArrowLeft: focusPrevKey,
            Escape: blur,
        };

        function onKeyDown(event: KeyboardEvent) {
            const { activeElement } = document;
            if (!activeElement) {
                return;
            }

            const action = keyActions[event.key];
            if (action) {
                action();
            }
        }

        function focusNextKey() {
            const { activeElement } = document;
            if (!activeElement) {
                return;
            }

            const keyElements = Array.from(container.querySelectorAll('.c-piano-key')) as HTMLDivElement[];
            const currentIndex = keyElements.findIndex(k => k === activeElement);

            if (currentIndex < keyElements.length - 1) {
                keyElements[currentIndex + 1].focus();
                return;
            }

            keyElements[0].focus();
        }

        function focusPrevKey() {
            const { activeElement } = document;
            if (!activeElement) {
                return;
            }

            const keyElements = Array.from(container.querySelectorAll('.c-piano-key')) as HTMLDivElement[];
            const currentIndex = keyElements.findIndex(k => k === activeElement);

            if (currentIndex > 0) {
                keyElements[currentIndex - 1].focus();
                return;
            }

            keyElements[keyElements.length - 1].focus();
        }

        function blur() {
            if (!document.activeElement) {
                return;
            }

            const activeElement = document.activeElement as HTMLDivElement;
            activeElement.blur();
        }
    }
};
