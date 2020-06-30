import Assembler from './Assembler';
import Decoder from './Decoder';
import ALU from './ALU';
import Memory from './Memory';

class Simulation {

    /** Note: All storage uses Big Endian */
    /** Note: User defined variable is not supported */

    /**
     * Constructor of the simulator
     * @param {String[]} instruction 
     */
    constructor(instruction) {
        this.assembler = new Assembler(instruction);
        this.decoder = undefined;
        this.alu = new ALU();
        this.memory = new Memory();
        this.assembled = false;
    }

    assemble = async () => {
        try {
            let instruction = await this.assembler.validate();
            this.decoder = new Decoder(instruction);
            this.assembled = true;
        } catch (error) {
            throw error;
        }
    }

    step() {

        if (!this.assembled)
            return 1;
        if (!this.decoder.hasNext())
            return 2;
        else
            /** Get next instruction and increment PC */
            this.decoder.next();

        let type = this.decoder.getInstructionType();
        let name = this.decoder.getInstructionName();
        let argv = this.decoder.currentInstruction;
        let signal = this.decoder.getControlSignal();
        let readOutput = this.decoder.readInstructionRegValue();

        /** Execute */
        let aluOutput = undefined;

        switch(type) {
            case 0:
                aluOutput = this.alu.executeTypeZero(name);
                break;
            case 1:
                aluOutput = this.alu.executeTypeOne(name, readOutput);
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

        if (signal.memWrite) {

            if (signal.postIndex)
                this.memory.write(readOutput[1], readOutput[0]);
            else
                this.memory.write(aluOutput, readOutput[0]);
        }
        
        if (signal.memRead) {

            if (signal.postIndex)
                memRead = this.memory.read(readOutput[1]);
            else
                memRead = this.memory.read(aluOutput);
        }

        /** Write back */
        if (signal.writeBack) {

            if (signal.memRead) {
                this.decoder.writeRegister(argv[1], memRead);
            } else if (aluOutput !== undefined) {
                this.decoder.writeRegister(argv[1], aluOutput);
            } else {
                this.decoder.writeRegister(argv[1], readOutput[0]);
            }
        }

        /** Branch*/
        if (signal.jump && aluOutput) {
            this.decoder.writeRegister(
                'pc',
                this.assembler.lookup(argv[1])
            );
        }

        return 0;
    }

    run() {
        // Check syntax
        // this.debug();
    }
}

export default Simulation;