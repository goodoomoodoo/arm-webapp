import Assembler, {LUT} from './assembler';

describe('Assembler Sanity Test', () => {
    let amb: Assembler = new Assembler([]);

    it('Build Instruction Map', () => {
        let instrTable: LUT = amb.buildInstrMap();
        let expectedTable: LUT = {
            'b': 0,
            'beq': 0,
            'bne': 0,
            'bl': 0,
            'blt': 0,
            'ble': 0,
            'bgt': 0,
            'bge': 0,
            'bx': 0,
            'add': 1,
            'and': 1,
            'asr': 1,
            'eor': 1,
            'lsl': 1,
            'lsr': 1,
            'mul': 1,
            'orr': 1,
            'sub': 1,
            'ldr': 2,
            'ldrb': 2,
            'str': 2,
            'strb': 2,
            'push': 3,
            'pop': 3,
            'mov': 4,
            'mvn': 4,
            'cmp': 4
        }

        for (let key of Object.keys(expectedTable)) {
            expect(instrTable[key]).toEqual(expectedTable[key]);
        }

        console.log(instrTable);
    });

    it('Filter Label with No Instruction', () => {
        let cmd: string[] = ['start:'];
        let labelTable: LUT = amb.filterLabel(cmd);

        /* Label table shouldn't care and default to 0 */
        expect(labelTable['start']).toBe(0);
    });

    it('Filter Label with Instruction', () => {
        let cmd1: string[] = ['start: mov r1, r2'];
        let cmd2: string[] = ['start:', 'mov r1, r2'];
        let lt1: LUT = amb.filterLabel(cmd1);
        let lt2: LUT = amb.filterLabel(cmd2);

        /* Labels should point to pc 0 */
        expect(lt1['start']).toBe(0);
        expect(lt2['start']).toBe(0);
    });

    it('Trim Instruction', () => {
        let cmd1: string[] = ['     mov   r1   ,r2    \n\t'];
        let cmd2: string[] = ['\t\tmov r1, r2   \n  '];
        amb.trimInstruction(cmd1);
        amb.trimInstruction(cmd2);

        expect(cmd1).toStrictEqual(['mov   r1   ,r2']);
        expect(cmd2).toStrictEqual(['mov r1, r2']);
    });
});