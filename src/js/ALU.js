class ALU {

    constructor() {
        this.flag = {
            zero: 0,
            overflow: 0,
            negative: 0,
            carry: 0
        }
    }

    executeTypeZero(args) {
        let instructionName = args.name;

        switch (instructionName) {
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

    executeImmediateTypeOne(args) {
        let instructionName = args.name;

        switch (instructionName) {
            case 'add':
                return args.rSrc + args.immd;
            case 'sub':
                return args.rSrc - args.immd;
            case 'asr':
                return args.rSrc >> args.immd;
            case 'eor':
                return args.rSrc ^ args.immd;
            case 'lsl':
                return args.rSrc << args.immd;
            case 'lsr':
                return args.rSrc >>> args.immd;
            case 'mul':
                return args.rSrc * args.immd;
            case 'orr':
                return args.rSrc | args.immd;
        }
    }

    executeTypeOne(args) {
        let instructionName = args.name;

        switch (instructionName) {
            case 'add':
                return args.rSrc + args.rSrc2;
            case 'sub':
                return args.rSrc - args.rSrc2;
            case 'asr':
                return args.rSrc >> args.rSrc2;
            case 'eor':
                return args.rSrc ^ args.rSrc2;
            case 'lsl':
                return args.rSrc << args.rSrc2;
            case 'lsr':
                return args.rSrc >>> args.rSrc2;
            case 'mul':
                return args.rSrc * args.rSrc2;
            case 'orr':
                return args.rSrc | args.rSrc2;
        }
    }

    executeTypeTwo(args) {
        return args.offset === undefined ? args.rBase : 
            args.rBase + args.offset;
    }

    executeTypeThree(args) {
        // Not supported yet. not an rudimentary function
    }

    /**
     * Type 4 instruction bypass ALU
     */
}

export default ALU;