const INSTR_TYPE = {
    0: [ 'b', 'beq', 'bne', 'bl', 'blt', 'ble', 'bgt', 'bge', 'bx' ],
    1: [ 'add', 'and', 'asr', 'eor', 'lsl', 'lsr', 'mul', 
        'orr', 'sub'],
    2: [ 'ldr', 'ldrb', 'str', 'strb' ],
    3: [ 'push', 'pop' ],
    4: [ 'mov', 'mvn', 'cmp' ]
};

class Decoder {

    constructor() {
        this.instructionLUT = this.build();
    }

    build() {
        let instructionLUT = {}

        for (let i = 0; i < 5; i++) {
            INSTR_TYPE[`${i}`].forEach((val, idx) => {
                instructionLUT[`${val}`] = i;
            });
        }

        return instructionLUT;
    }

    /**
     * e.g. instructionHead = 'mov'
     * @return 1
     */
    getInstructionType(instruction) {
        return this.instructionLUT[this.getInstructionName(instruction)];
    }

    /**
     * Returns the instruction of a line
     * @param {String} instruction 
     * @return {Promise(resolve String)} instruction name
     */
    getInstructionName(instruction) {

        let instructionName = instruction.split(' ')[0];

        return instructionName;
    }

    /**
     * Get the arguments of an instruction
     * Note: Instructions need to be checked before
     * @param {Number} instructionType 
     * @param {String} instruction 
     */
    getInstructionArgs(instruction) {

        let args = instruction.substring(instruction.indexOf(' ') + 1);

        args = args.replace(/\s/g, '');

        let arr = args.split(',');

        let instructionName = this.getInstructionName(instruction);

        let instructionType = this.getInstructionType(instruction);

        if( instructionType == 0 ) {
            return {
                name: instructionName,
                label: arr[ 0 ]
            };
        }

        if( instructionType == 1 ) {

            let rd = arr[ 0 ].toLowerCase();
            let rSrc = arr[ 1 ].toLowerCase();
            let rSrc2 = arr[ 2 ].toLowerCase();

            return this.isImmediateValue(rSrc2) ?
                {
                    name: instructionName,
                    rd: rd,
                    rSrc: rSrc,
                    immd: parseInt(rSrc2.substring(1, rSrc2.length))
                } :
                {
                    name: instructionName,
                    rd: rd,
                    rSrc: rSrc,
                    rSrc2: rSrc2
                };
        }

        if( instructionType == 2 ) {

            let rd = arr[ 0 ].toLowerCase();
            let rSrc = arr[ 1 ].toLowerCase();
            let offset = arr[ 2 ];
            
            /** Remove '[' in the front of base register */
            rSrc = rSrc.substring( 1, rSrc.length );

            /** No offset found */
            if( arr[2] === undefined ) {

                /** Remove ']' at the end of base register */
                rSrc = rSrc.substring( 0, rSrc.length - 1 );

                return {
                    name: instructionName,
                    rd: rd,
                    rSrc: rSrc
                };
            } 
            /** Offset found */
            else {

                /** Remove ']' at the end of offset value */
                offset = offset.substring( 1, offset.length - 1 ).toLowerCase();

                return {
                    name: instructionName,
                    rd: rd,
                    rSrc: rSrc,
                    offset: parseInt(offset)
                };
            }
        }

        if( instructionType == 3 ) {

            /** Remove {} in the instruction */
            if (arr.length > 1) {
                arr[0] = arr[0].substring(1,arr[0].length);
                arr[arr.length - 1] = arr[arr.length - 1].substring(0, 
                    arr[arr.length - 1].length - 1);
            } else {
                arr[0] = arr[0].substring(1, arr[0].length - 1);
            }

            return {
                name: instructionName,
                rArr: arr
            };
        }

        if (instructionType == 4) {
            
            let rd = arr[0].toLowerCase();
            let rSrc = arr[1].toLowerCase();

            return this.isImmediateValue(rSrc) ? 
                {
                    name: instructionName,
                    rd: rd,
                    immd: parseInt(rSrc.substring(1,rSrc.length))
                } :
                {
                    name: instructionName,
                    rd: rd,
                    rSrc: rSrc
                }
        }

        return {};
    }

    /**
     * Check if the instruction has arguments
     * @param {String} instruction 
     * @return {Boolean}
     */
    hasInstructionArgs(instruction) {

        let indexOfArgs = instruction.indexOf(' ') + 1;

        return indexOfArgs > instruction.length;
    }
    
    /**
     * Check if the instruction name is valid
     * @param {String} instructionName 
     * @return {Boolean}
     */
    isValidInstructionName(instructionName) {

        return this.instructionLUT[`${instructionName}`] === undefined
    }

    /**
     * Check if the register argument is immediate value
     * @param {String} arg 
     */
    isImmediateValue(arg) {
        return arg.charAt(0) === '#';
    }
}

export default Decoder;