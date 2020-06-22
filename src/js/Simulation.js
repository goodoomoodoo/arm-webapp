import Decoder from './Decoder';
import Register from './Register';
import ALU from './ALU';
import Memory from './Memory';

class Simulation {

    /** Note: All storage uses Big Endian */

    /**
     * Constructor of the simulator
     * @param {String[]} instruction 
     */
    constructor(instruction) {
        this.decoder = new Decoder();
        this.instruction = instruction;
        this.register = new Register();
        this.alu = new ALU();
        this.memory = new Memory();
    }

    step() {
        // Check syntax
        // this.debug();

        /** Fetch */
        let pc = this.register.pc;
        let currentInstruction = this.instruction[pc];

        /** Decode */
        let type = this.decoder.getInstructionType(currentInstruction);
        let args = this.decoder.getInstructionArgs(currentInstruction);
        let readOutput = this.register.read(args);

        /** Execute */
        let aluOutput = undefined;

        switch(type) {
            case 0:
                aluOutput = this.alu.executeTypeZero(readOutput);
                break;
            case 1:
                if (args.immd !== undefined)
                    aluOutput = this.alu.executeImmediateTypeOne(readOutput);
                else
                    aluOutput = this.alu.executeTypeOne(readOutput);
                break;
            case 2:
                aluOutput = this.alu.executeTypeTwo(readOutput);
                break;
            case 3:
                aluOutput = this.alu.executeTypeThree(readOutput);
                break;
            case 4:
                // Type 4 bypass ALU
                break;
        }

        /** Memory */
        let memRead = 0;

        if (type === 2) {

            if (args.name === 'str' || args.name === 'strb') {
                this.memory.write(aluOutput, readOutput.rd);
            } else {
                memRead = this.memory.read(aluOutput);
            }
        }

        /** Write back */
        if (type === 2) {

            if (args.name === 'ldr') {

                this.register[args.rd] = memRead;

            } else if (args.name === 'ldrb') {

                this.register[args.rd] = memRead & 0xf;
            }
        }

        if (type === 1) {

            this.register[args.rd] = aluOutput;
        }

        if (type === 4) {

            if (args.immd)
                this.register[args.rd] = args.immd;
            else
                this.register[args.rd] = readOutput.rSrc;
        }

        /** Branch/Increment */
        this.register.pc++;

        if (type === 0) {

            if(aluOutput)
                this.register.pc = labelLUT;
        }
    }

    run() {
        // Check syntax
        // this.debug();
    }

    debug() {

    }
}

export default Simulation;