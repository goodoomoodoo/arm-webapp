import Decoder from './Decoder';
import Register from './Register';
import ALU from './ALU';

class Simulation {

    /**
     * Constructor of the simulator
     * @param {String[]} instruction 
     */
    constructor(instruction) {
        this.decoder = new Decoder();
        this.instruction = instruction;
        this.register = new Register();
        this.alu = new ALU();
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
        let aluOutput = 0;

        /** Execute */
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
    }

    run() {
        // Check syntax
        // this.debug();
    }

    debug() {

    }
}

export default Simulation;