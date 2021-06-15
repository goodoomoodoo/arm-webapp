import ALU from './alu/alu';
import Assembler from './assembler/assembler';
import Decoder from './decoder/decoder';
import Memory from './memory/memory';
import RegisterFile, {CallBackType} from './register/register';

export default class Simulation {
    /**
     * Simulation class is the top level module that integrates all modules
     * together.
     */

    assembler: Assembler;
    decoder: Decoder;
    alu: ALU;
    memFile: Memory;
    regFile: RegisterFile;
    assembled: boolean;
    memCallBack: Function;
    regCallBack: CallBackType;

    constructor() {
        this.assembler = null as any;
        this.decoder = null as any;
        this.alu = new ALU();
        this.memFile = new Memory();
        this.regFile = new RegisterFile();
        this.assembled = false;
        this.memCallBack = null as any;
        this.regCallBack = null as any;

        this.assemble = this.assemble.bind(this);
        this.step = this.step.bind(this);
    }

    assemble = async (instr: string[]) => {
        /* Assembled instruction */
        this.assembler = new Assembler(instr);
        let ambInstr: string[][][] = await this.assembler.assemble();
        this.decoder = new Decoder(ambInstr, this.regFile);
        this.assembled = true;
    }

    step(): number {
        if (!this.assembled) return 1;
        
        if (this.decoder.currInstr === undefined) return 2;

        while (!this.decoder.subInstrDone()) {
            let i: number = this.decoder.counter;

            /* Execute */
            let aluOut: number = 0;
            switch (this.decoder.currInstrType) {
                case 0:
                    aluOut = this.alu.executeTypeZero(this.decoder.currInstrV);
                    break;
                case 1:
                    aluOut = this.alu.executeTypeOne(this.decoder.currInstrV,
                                                     this.regFile);
                    break;
                case 2:
                    aluOut = this.alu.executeTypeTwo(this.decoder.currInstrV,
                                                     this.regFile);
                    break;
                case 4:
                    aluOut = this.alu.executeTypeFour(this.decoder.currInstrV,
                                                      this.regFile);
            }

            /* Memory */
            let memRead: number = 0;

            if (this.decoder.control.memWrite) {
                if (this.decoder.currInstrName === 'str') {
                    this.memFile.write(
                        aluOut, 
                        this.regFile.block[this.decoder.currInstrV[1]],
                        this.memCallBack
                    );
                } else {
                    this.memFile.writeByte(
                        aluOut,
                        this.regFile.block[this.decoder.currInstrV[1]],
                        this.memCallBack
                    )
                }
            }

            if (this.decoder.control.memRead) {
                if (this.decoder.currInstrName === 'ldr') {
                    memRead = this.memFile.read(aluOut);
                } else {
                    memRead = this.memFile.readByte(aluOut);
                }
            }
            
            /* Write Back */
            if (this.decoder.control.writeBack) {
                if (this.decoder.control.memRead) {
                    this.regFile.write(this.decoder.currInstrV[1],
                                       memRead,
                                       this.regCallBack);
                } else if (this.decoder.currInstrType == 4) {
                    this.regFile.write(this.decoder.currInstrV[1],
                                       parseInt(this.decoder.currInstrV[2]),
                                       this.regCallBack);
                } else {
                    this.regFile.write(this.decoder.currInstrV[1],
                                       aluOut,
                                       this.regCallBack);
                }
            }

            /* Branch */
            if (this.decoder.control.jump && aluOut == 1) {
                this.regFile.block.pc = parseInt(this.decoder.currInstrV[1]);
            }

            this.decoder.nextSubInstr();
        }

        /* Move to next intruction */
        if (this.decoder.hasNext()) this.decoder.next();

        return 0;
    }

    run() {
        while (this.decoder.hasNext()) this.step();
    }
}