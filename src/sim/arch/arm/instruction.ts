interface InstructionTableR {
    0: string[]
    1: string[]
    2: string[]
    3: string[]
    4: string[]
}

export interface InstructionTable {
    [prop: string]: number
}

export const INSTR_TABLE_R: InstructionTableR = {
    0: [ 'b', 'beq', 'bne', 'bl', 'blt', 'ble', 'bgt', 'bge', 'bx' ],
    1: [ 'add', 'and', 'asr', 'eor', 'lsl', 'lsr', 'mul', 'orr', 'sub'],
    2: [ 'ldr', 'ldrb', 'str', 'strb' ],
    3: [ 'push', 'pop' ],
    4: [ 'mov', 'mvn', 'cmp']
}

function buildInstrTable(): InstructionTable {
    let instrTable: InstructionTable = {};

    for (let [type, instrNames] of Object.entries(INSTR_TABLE_R)) {
        for (let instrName of instrNames) {
            instrTable[instrName] = parseInt(type);
        }
    }

    return instrTable;
}

export const INSTR_TABLE: InstructionTable = buildInstrTable();