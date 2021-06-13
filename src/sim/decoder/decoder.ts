import {INSTR_TABLE, InstructionTable} from '../arch/arm/instruction';
import RegisterFile from '../register/register';

interface SignalBlock {
    writeBack: boolean,
    memRead: boolean,
    memWrite: boolean,
    jump: boolean,
    preIndex: boolean,
    postIndex: boolean
}

export default class Decoder {
    /**
     * Decoder class tracks the current instruction and return the decoded value
     * of the current instruction, including instruction type, register value,
     * and signal value.
     * 
     * Decoder expect 'pc' register to be defined in the register file.
     */

    instrTable: InstructionTable;
    control: SignalBlock;
    instr: string[][][];
    currInstr: string[][];
    regFile: RegisterFile;
    counter: number;

    constructor(assembledInstr: string[][][], regFile: RegisterFile) {
        this.instrTable = INSTR_TABLE;
        this.counter = 0;
        this.control = {
            writeBack: true,
            memRead: false,
            memWrite: false,
            jump: false,
            preIndex: false,
            postIndex: false
        };
        this.instr = assembledInstr;
        this.currInstr = this.instr[regFile.block.pc];
        this.regFile = regFile;
        this.updateControl();
    }

    get currInstrV(): string[] {
        return this.currInstr[this.counter];
    }

    get currInstrName(): string {
        return this.currInstr ? this.currInstr[this.counter][0] : '';
    }

    get currInstrType(): number {
        return this.currInstr ? this.instrTable[this.currInstrName] : -1;
    }

    resetControl() {
        this.control = {
            writeBack: true,
            memRead: false,
            memWrite: false,
            jump: false,
            preIndex: false,
            postIndex: false
        };
    }

    updateControl() {
        let currType: number = this.currInstrType;

        if (currType == 0) {
            this.control.writeBack = false;
            this.control.jump = true;
        }

        if (currType == 2) {
            if (this.currInstrName.includes('str')) {
                this.control.writeBack = false;
                this.control.memWrite = true;
            } else {
                this.control.memRead = true;
            }

            /* Check the argument for pre-index and post-index */
            let last: string = this.currInstr[this.counter][this.currInstr.length - 1];
            if (last.charAt(last.length - 1) === '!' &&
                this.currInstr.length >= 4) {
                this.control.preIndex = true;
            } else if (last.charAt(last.length - 1) !== ']' &&
                this.currInstr.length >= 4) {
                this.control.postIndex = true;
            }
        }

        if (currType == 4) {
            if (this.currInstrName === 'cmp') {
                this.control.writeBack = false;
            }
        }
    }

    hasNext(): boolean {
        return this.instr[this.regFile.block.pc + 1] !== undefined;
    }

    subInstrDone(): boolean {
        return this.counter == this.currInstr.length;
    }

    nextSubInstr() {
        this.counter++;

        if (!this.subInstrDone()) {
            this.resetControl();
            this.updateControl();
        }
    }

    next() {
        if (this.subInstrDone()) {
            this.regFile.block.pc++;
            this.currInstr = this.instr[this.regFile.block.pc];
            this.counter = 0;
            this.resetControl();
            this.updateControl();
        }
    }
}