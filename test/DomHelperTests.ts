import DomHelper from '../src/DomHelper';

type Config = Record<string, string>;

describe('DomHelper', () => {

    describe('createLine', () => {

        it('should return an SVGElement', () => {
            const line = createMockLine();

            expect(line instanceof SVGElement).toBe(true);
        });

        it('should create line with attributes', () => {
            const line = createMockLine();

            expect(line.getAttribute('x1')).toBe('10');
            expect(line.getAttribute('x2')).toBe('20');
            expect(line.getAttribute('y1')).toBe('30');
            expect(line.getAttribute('y2')).toBe('40');
            expect(line.getAttribute('stroke')).toBe('black');
        });

        it('should default color to black if not provided', () => {
            const line = createMockLine();

            expect(line.getAttribute('stroke')).toBe('black');
        });

        it('should default width to 1 if not provided', () => {
            const line = createMockLine();

            expect(line.getAttribute('stroke-width')).toBe('1');
        });

        function createMockLine(config: Config = {}) {
            return DomHelper.createLine({
                x1: 10,
                x2: 20,
                y1: 30,
                y2: 40,
                ...config
            });
        }
    });

    describe('createRect', () => {

        it('should return an SVGElement', () => {
            const rect = createMockRect();

            expect(rect instanceof SVGElement).toBe(true);
        });

        it('should create rect with attributes', () => {
            const rect = createMockRect();

            expect(rect.getAttribute('x')).toBe('10');
            expect(rect.getAttribute('y')).toBe('20');
            expect(rect.getAttribute('width')).toBe('500');
            expect(rect.getAttribute('height')).toBe('1000');
        });

        it('should default color to black if not provided', () => {
            const line = createMockRect();

            expect(line.getAttribute('fill')).toBe('black');
            expect(line.getAttribute('stroke')).toBe('black');
        });

        function createMockRect(config: Config = {}) {
            return DomHelper.createRect({
                x: 10,
                y: 20,
                width: 500,
                height: 1000,
                ...config,
            });
        }
    });

    describe('createAnimation', () => {

        it('should return an SVGElement', () => {
            const animation = createMockAnimation();

            expect(animation instanceof SVGElement).toBe(true);
        });

        it('should create animation with attributes', () => {
            const animation = createMockAnimation();

            expect(animation.getAttribute('attributeName')).toBe('x');
            expect(animation.getAttribute('values')).toBe('100;200;100;');
            expect(animation.getAttribute('dur')).toBe('0.5s');
            expect(animation.getAttribute('repeatCount')).toBe('indefinite');
            expect(animation.getAttribute('begin')).toBe('0s');
        });

        function createMockAnimation() {
            return DomHelper.createAnimation(
                'x',
                '100;200;100;',
                '0.5s'
            );
        }
    });

});
