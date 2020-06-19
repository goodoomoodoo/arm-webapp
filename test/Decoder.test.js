import Decoder from '../src/js/Decoder';

describe('Decoder Simple Test', () => {
    let decoder = new Decoder();

    it('getInstructionName Simple Test', () => {

        expect(decoder.getInstructionName('mov r1, #0')).toBe('mov');
    });

    it('getInstructionType Simple Test', () => {

        expect(decoder.getInstructionType('mov r1, #0')).toBe(4);
    });

    it('getInstructionArgs Type 0 Simple Test', () => {

        expect(decoder.getInstructionArgs('b loop'))
            .toMatchObject({name: 'b', label: 'loop'});
    });

    it('getInstructionType Type 1 Simple Test 0', () => {

        expect(decoder.getInstructionArgs('add r1, r2, r3'))
            .toMatchObject({
                name: 'add',
                rd: 'r1',
                rSrc: 'r2',
                rSrc2: 'r3'
            });
    });

    it('getInstructionType Type 1 Simple Test 1', () => {

        expect(decoder.getInstructionArgs('add r1, r2, #3'))
            .toMatchObject({
                name: 'add',
                rd: 'r1',
                rSrc: 'r2',
                immd: 3
            });
    });

    it('getInstructionType Type 2 Simple Test 1', () => {

        expect(decoder.getInstructionArgs('ldr r1, [r0]'))
            .toMatchObject({
                name: 'ldr',
                rd: 'r1',
                rSrc: 'r0'
            });
    });

    it('getInstructionType Type 2 Simple Test 2', () => {

        expect(decoder.getInstructionArgs('ldr r1, [r0, #10]'))
            .toMatchObject({
                name: 'ldr',
                rd: 'r1',
                rSrc: 'r0',
                offset: 10
            });
    });

    it('getInstructiontype Type 3 Simple Test', () => {

        expect(decoder.getInstructionArgs('push {r1}'))
            .toMatchObject({
                name: 'push',
                rArr: ['r1']
            });
    })
});