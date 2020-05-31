const INSTR_TYPE = {
    0: [ 'b', 'beq', 'bne', 'bl', 'blt', 'ble', 'bgt', 'bge', 'bx' ],
    1: [ 'add', 'and', 'asr', 'cmp', 'eor', 'lsl', 'lsr', 'mov', 'mvn', 'mul', 
        'orr', 'sub'],
    2: [ 'ldr', 'ldrb', 'str', 'strb' ],
    3: [ 'push', 'pop' ]
};

class Decoder {

    constructor() {
        this.instructionLUT = this.build();
    }

    build() {
        let instructionLUT = {}

        for (let i = 0; i < 4; i++) {
            INSTR_TYPE[`${i}`].forEach((val, idx) => {
                instructionLUT[`${val}`] = i;
            });
        }

        console.log(instructionLUT);

        return instructionLUT;
    }

    /**
     * e.g. instructionHead = 'mov'
     * @return 1
     */
    getInstructionType(instructionHead) {
        return this.instructionLUT[`${instructionHead}`];
    }
}

export default Decoder;