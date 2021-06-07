import {Register} from '../../register/register';

interface InstructionTable {
    0: string[]
    1: string[]
    2: string[]
    3: string[]
    4: string[]
}

type InstructionVector = string[];

export const INSTRUCTION: InstructionTable = {
    0: [ 'b', 'beq', 'bne', 'bl', 'blt', 'ble', 'bgt', 'bge', 'bx' ],
    1: [ 'add', 'and', 'asr', 'eor', 'lsl', 'lsr', 'mul', 'orr', 'sub'],
    2: [ 'ldr', 'ldrb', 'str', 'strb' ],
    3: [ 'push', 'pop' ],
    4: [ 'mov', 'mvn', 'cmp']
}