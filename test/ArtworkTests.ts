import Artwork from '../src/Artwork';

describe('Artwork', () => {
    const mockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const artwork = new Artwork(mockSvg);

    beforeEach(() => {
        mockSvg.appendChild = jest.fn();
    });

    describe('addLineGroup', () => {
        it('should batch svg append calls', () => {
            const config = {
                width: 1000,
                height: 500,
                lineCount: 5,
                lineOrientation: 'horizontal',
                x: 10,
                y: 20,
            };
            const transitionStates = [
                { lineCount: 4 },
                { lineCount: 10 },
                { lineCount: 2 },
            ];
            artwork.addLineGroup(config, transitionStates);

            expect(mockSvg.appendChild).toBeCalledTimes(1);
        });
    });
});
