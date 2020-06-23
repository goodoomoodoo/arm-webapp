import labelLUT from './labelLUT';
import {REGISTER_NAME, INSTR_TYPE} from './constants';

class Assembler {
    
    /**
     * Constructor of Assembler
     * @param {String[]} instruction 
     */
    constructor(instruction) {
        this.lut = new labelLUT(instruction);
        this.decoder = new Decoder();
        this.instructionLUT = this.build();
    }

    build() {
        let instructionLUT = {}

        for (let i = 0; i < 5; i++) {
            INSTR_TYPE[`${i}`].forEach((val, idx) => {
                instructionLUT[`${val}`] = i;
            });
        }

        return instructionLUT;
    }

    /**
     * Remove empty line, whitespaces, and tabs
     * @param {String[]} instruction 
     * @return {String[]}
     */
    trimInstruction(instruction) {

        // TODO

        return instruction;
    }

    validate() {

        let labelessInstruction = this.lut.getLabelessInstruction();
        let trimmedInstruction = this.trimInstruction(labelessInstruction);

        for (let i = 0; i < trimmedInstruction.length; i++) {

            let currentInstruction = trimmedInstruction[i];

            
        }
    }

    /**
     * 
     * @param {String} instruction 
     */
    validateInstructionName(instruction) {

        let instructionName = instruction.split(' ')[0];

        return new Promise((resolve, reject) => {
            if (this.instructionLUT[instructionName] === undefined)
                reject(new Error(`Instruction ${instructionName} not found.`));
            else
                resolve(this.instructionLUT[instructionName]);
        });
    }

    lookup(label) {
        return this.lut.lookup(label);
    }
}

export default Assembler;