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
    instr: string[][];
    currInstr: string[];
    regFile: RegisterFile;

    constructor(assembledInstr: string[][], regFile: RegisterFile) {
        this.instrTable = INSTR_TABLE;
        this.control = {
            writeBack: true,
            memRead: false,
            memWrite: false,
            jump: false,
            preIndex: false,
            postIndex: false
        };
        this.instr = assembledInstr;
        this.currInstr = null as any;
        this.regFile = regFile;
    }

    get currInstrName(): string {
        return this.currInstr ? this.currInstr[0] : '';
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

    hasNext(): boolean {
        return this.instr[this.regFile.block.pc] !== undefined;
    }

    next() {
        if (this.hasNext()) {
            this.currInstr = this.instr[this.regFile.block.pc];
            this.regFile.block.pc++;
            this.resetControl();

            /* Update the control signal based on the instruction type */
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
                let last: string = this.currInstr[this.currInstr.length - 1];
                if (last.charAt(last.length - 1) === '!' &&
                    this.currInstr.length >= 4) {
                    this.control.preIndex = true;
                } else if (last.charAt(last.length - 1) !== ']' &&
                    this.currInstr.length >= 4) {
                    this.control.postIndex = true;
                }
            }
        }
    }
}