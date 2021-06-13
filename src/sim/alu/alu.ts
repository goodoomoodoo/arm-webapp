import RegisterFile from '../register/register';

interface LogicFlag {
    zero: number
    overflow: number
    negative: number
    carry: number
}

export enum Flag {
    low = 0,
    high
}

export default class ALU {
    /**
     * ALU class does the arithmetic and logic stuff
     */

    flag: LogicFlag;

    constructor() {
        this.flag = {
            zero: Flag.low,
            overflow: Flag.low,
            negative: Flag.low,
            carry: Flag.low
        };
    }

    /**
     * Return jump boolean with repect to the branch type.
     * @param instr 
     * @returns 
     */
    executeTypeZero(instr: string[]): number {
        switch (instr[0]) {
            case 'b':
                return Flag.high;
            case 'beq':
                return this.flag.zero;
            case 'bne':
                return this.flag.zero;
            case 'bl':
                return Flag.high;
            case 'blt':
                return this.flag.negative;
            case 'bgt':
                return (this.flag.zero | this.flag.negative) ^ 1;
            case 'ble':
                return this.flag.negative | this.flag.zero;
            case 'bge':
                return this.flag.zero | (this.flag.negative ^ 1);
            case 'bx':
                return Flag.high;
        }

        return 0;
    }

    /**
     * Execute arithmetic operations.
     * @param instr 
     * @param regFile 
     * @returns 
     */
    executeTypeOne(instr: string[], regFile: RegisterFile): number {
        let args: number[] = [0, 0];

        /* Replace instruction register with number value */
        args[0] = regFile.block[instr[2]];

        if (!isNaN(Number(instr[3]))) {
            args[1] = parseInt(instr[3]);
        } else {
            args[1] = regFile.block[instr[3]];
        }

        switch (instr[0]) {
            case 'add':
                return args[0] + args[1];
            case 'sub':
                return args[0] - args[1];
            case 'asr':
                return args[0] >> args[1];
            case 'eor':
                return args[0] ^ args[1];
            case 'lsl':
                return args[0] << args[1];
            case 'lsr':
                return args[0] >>> args[1];
            case 'mul':
                return args[0] * args[1];
            case 'orr':
                return args[0] | args[1];
            case 'cmp':
                
        }

        return 0;
    }

    /**
     * Type two instruction including ldr and str expect at least two 
     * arguments, both register.
     * @param instr 
     */
    executeTypeTwo(instr: string[], regFile: RegisterFile): number {
        if (instr[3]) {
            return regFile.block[instr[2]] + parseInt(instr[3]);
        } else {
            return regFile.block[instr[2]];
        }
    }

    /**
     * Bypass instruction unless is cmp, then change internal flag.
     * @param instr 
     * @param regFile 
     * @returns 
     */
    executeTypeFour(instr: string[], regFile: RegisterFile): number {
        if (instr[0] === 'cmp') {
            let args: number[] = [0, 0];

            /* Replace instruction register with number value */
            args[0] = regFile.block[instr[1]];

            if (!isNaN(Number(instr[2]))) {
                args[1] = parseInt(instr[2]);
            } else {
                args[1] = regFile.block[instr[2]];
            }

            let res: number = args[0] - args[1];

            this.flag.negative = res < 0 ? Flag.high : Flag.low;
            this.flag.zero = res == 0 ? Flag.high : Flag.low;
        }
        
        return 0;
    }
}