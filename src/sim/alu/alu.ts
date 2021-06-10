import RegisterFile from '../register/register';
import {checkIsImmediate, checkIsRegister} from '../assembler/assembler';

interface LogicFlag {
    zero: number
    overflow: number
    negative: number
    carry: number
}

export default class ALU {
    /**
     * ALU class does the arithmetic and logic stuff
     */

    flag: LogicFlag;

    constructor() {
        this.flag = {
            zero: 0,
            overflow: 0,
            negative: 0,
            carry: 0
        };
    }

    executeTypeZero(instr: string[]): number {
        switch (instr[0]) {
            case 'b':
                return 1;
            case 'beq':
                return this.flag.zero;
            case 'bne':
                return this.flag.zero;
            case 'bl':
                return 1;
            case 'blt':
                return this.flag.negative;
            case 'bgt':
                return (this.flag.zero | this.flag.negative) ^ 1;
            case 'ble':
                return this.flag.negative | this.flag.zero;
            case 'bge':
                return this.flag.zero | (this.flag.negative ^ 1);
            case 'bx':
                return 1;
        }

        return 0;
    }

    executeTypeOne(instr: string[], regFile: RegisterFile): number {
        let args: number[] = [0, 0];

        /* Replace instruction register with number value */
        args[0] = regFile.block[instr[1]];

        if (checkIsImmediate(instr[2])) {
            args[1] = parseInt(instr[2]);
        } else {
            args[1] = regFile.block[instr[2]];
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
                let res: number = args[0] - args[1];

                this.flag.negative = res < 0 ? 1 : 0;
                this.flag.zero = res == 0 ? 1 : 0;
        }

        return 0;
    }

    executeTypeTwo(instr: string[]): number {
        //TODO need to implement pre and post index in assembler
        return 0;
    }
}