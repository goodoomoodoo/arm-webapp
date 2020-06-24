import Assembler from '../src/js/Assembler';

describe('Assembler Simple Test', () => {
    let assembler = new Assembler(['loop:','SMALLER:']);

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

    it('Assembler looup Simple Test', () => {

        expect(assembler.lookup('loop')).toBeGreaterThan(-1);
    })

    it('Assembler validateInstructionName Simple Test', async () => {

        let result = await assembler.validateInstructionName('mov r1, r2');

        expect(result).toBe('mov');

        try {
            await assembler.validateInstructionName('soup');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    it('Assembler validateTypeZeroInstruction Simple Test', async () => {

        let result = await assembler.validateTypeZeroInstruction('ble loop');

        expect(result).toBe('loop');

        result = await assembler.validateTypeZeroInstruction('b SMALLER');

        expect(result).toBe('SMALLER');

        try {
            await assembler.validateTypeZeroInstruction('b LABEL3');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }

        try {
            await assembler.validateTypeZeroInstruction('b label, label2');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    it('Assembler validateTypeOneInstruction Simple Test', async () => {

        let result = await assembler.validateTypeOneInstruction('eor r1, r5, r9');

        expect(result).toEqual(['r1', 'r5', 'r9']);

        result = await assembler.validateTypeOneInstruction('sub r1, r5, #100');

        expect(result).toEqual(['r1', 'r5', '#100']);

        try {
            await assembler.validateTypeOneInstruction('eor r1, r5, 66');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }

        try {
            await assembler.validateTypeOneInstruction('eor r1, r5');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    it('Assembler validateTypeTwoInstruction Simple Test', async () => {
        
        let result = await assembler.validateTypeTwoInstruction('ldr r1, [r2]');

        expect(result).toEqual(['r1', '[r2]']);

        result = await assembler.validateTypeTwoInstruction('ldr r1, [r2], #4');

        expect(result).toEqual(['r1', '[r2]', '#4']);

        result = await assembler.validateTypeTwoInstruction('ldr r1, [r2, #10]');

        expect(result).toEqual(['r1', '[r2', '#10]']);

        result = await assembler.validateTypeTwoInstruction('ldr r1, [r2, r3]');

        expect(result).toEqual(['r1', '[r2', 'r3]']);
    });
})