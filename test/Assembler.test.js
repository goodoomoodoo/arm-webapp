import Assembler from '../src/js/Assembler';

describe('Assembler Simple Test', () => {
    let assembler = new Assembler([]);

    it('Assember getInstructionName Simple Test', () => {
        
        let instruction1 = 'mov r1, r2';

        expect(assembler.getInstructionName(instruction1))
            .toBe('mov');

        let instruction2 = '  mov r1, r2';

        expect(assembler.getInstructionName(instruction2))
            .toBe('mov');

        let instruction3 = '  mov    r1, r2';

        expect(assembler.getInstructionName(instruction3))
            .toBe('mov');
    });

    it('Assember getInstructionArgs Simple Test', () => {

        let instruction1 = 'b loop';

        expect(assembler.getInstructionArgs(instruction1))
            .toEqual(['loop']);

        let instruction2 = 'mov r1, r2';

        expect(assembler.getInstructionArgs(instruction2))
            .toEqual(['r1', 'r2']);

        let instruction3 = 'add r1, r2, r3';

        expect(assembler.getInstructionArgs(instruction3))
            .toEqual(['r1', 'r2', 'r3']);

        let instruction4 = 'add   r1, r2, r3';

        expect(assembler.getInstructionArgs(instruction4))
            .toEqual(['r1', 'r2', 'r3']);

    });

    it('Assembler checkIsImmediate Simple Test', () => {
        
        expect(assembler.checkIsImmediate('#10')).toBe(true);

        expect(assembler.checkIsImmediate('#-20')).toBe(true);

        expect(assembler.checkIsImmediate('#-0')).toBe(false);

        expect(assembler.checkIsImmediate('#20a')).toBe(false);

        expect(assembler.checkIsImmediate('#a77')).toBe(false);

    });

    it('Assembler validateInstructionName Simple Test', async () => {

        let result = await assembler.validateInstructionName('mov r1, r2');

        expect(result).toBe('mov');

        try {
            await assembler.validateInstructionName('soup');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    })
})