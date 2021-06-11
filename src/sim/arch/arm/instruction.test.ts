import {INSTR_TABLE, InstructionTable} from './instruction';

describe('Instruction Static Test', () => {
    it('Verify Instruction Table', () => {
        let expectedTable: InstructionTable = {
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
            expect(INSTR_TABLE[key]).toEqual(expectedTable[key]);
        }

        console.log(INSTR_TABLE);
    });
});