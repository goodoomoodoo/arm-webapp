class ALU {

    constructor() {
        this.flag = {
            zero: 0,
            overflow: 0,
            negative: 0,
            carry: 0
        }
    }

    executeTypeZero(argv) {

        switch (argv[0]) {
            case 'b':
                return true;
            case 'beq':
                return this.flag.zero === 1;
            case 'bne':
                return this.flag.zero === 0;
            case 'bl':
                return true;
            case 'blt':
                return this.flag.negative === 1;
            case 'bgt':
                return this.flag.zero === 0 && this.flag.negative === 0;
            case 'ble':
                return this.flag.negative === 1 || this.flag.zero === 1;
            case 'bge':
                return this.flag.zero === 1 || this.flag.negative === 0;
            case 'bx':
                return true;
        }
    }

    executeTypeOne(name, argv) {

        switch (name) {
            case 'add':
                return argv[0] + argv[1];
            case 'sub':
                return argv[0] - argv[1];
            case 'asr':
                return argv[0] >> argv[1];
            case 'eor':
                return argv[0] ^ argv[1];
            case 'lsl':
                return argv[0] << argv[1];
            case 'lsr':
                return argv[0] >>> argv[1];
            case 'mul':
                return argv[0] * argv[1];
            case 'orr':
                return argv[0] | argv[1];
        }
    }

    executeTypeTwo(argv) {
        return argv[2] === undefined ? argv[1] : argv[1] + argv[2];
    }

    executeTypeThree(args) {
        // Not supported yet. not an rudimentary function
    }

    /**
     * Type 4 instruction bypass ALU
     */
}

export default ALU;