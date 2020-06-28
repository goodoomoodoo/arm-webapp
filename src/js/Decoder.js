import {INSTR_TYPE} from './constants';
import Register from './Register';

class Decoder {

    /**
     * 
     * @param {String[][]} instruction 
     */
    constructor(instruction) {
        this.instructionLUT = this.build();
        this.register = new Register();
        this.instruction = instruction;
        this.currentInstruction = undefined;
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

    getInstructionName() {
        return this.currentInstruction[0];
    }

    /**
     * e.g. instructionHead = 'mov'
     * @return {Number}
     */
    getInstructionType() {
        return this.instructionLUT[this.currentInstruction[0]];
    }

    /**
     * Get control signal of current instruction
     */
    getControlSignal() {
        
        let type = this.getInstructionType();
        let instructionName = this.currentInstruction[0];
        let arg1 = this.currentInstruction[1];
        let arg2 = this.currentInstruction[2];
        let control = {
            writeBack: true,
            memRead: false,
            memWrite: false,
            jump: false,
            preIndex: false,
            postIndex: false
        };

        switch (type) {
            case 0:
                control.writeBack = false;
                control.jump = true;
                break;
            case 1:
                break;
            case 2:
                if (instructionName.charAt(0) === 's') {
                    control.writeBack = false;
                    control.memWrite = true;
                } else {
                    control.memRead = true;
                }

                if (arg1.charAt(arg1.length - 1) !== ']') {

                    if (arg2.charAt(arg2.length - 1) === '!') {
                        control.preIndex = true;
                    }

                } else {

                    if (arg2)
                        control.postIndex = true;
                }

                break;
            case 3:
                break;
            case 4:
                break;  
        }

        return control;
    }

    /**
     * 
     * @param {Number} value 
     */
    setPC(value) {
        this.register.pc = value;
    }

    next() {
        this.currentInstruction = this.instruction[this.register.pc];
        this.register.pc++;
    }

    hasNext() {
        return this.instruction[this.register.pc] !== undefined;
    }

    /**
     * Get the arguments of an instruction
     * Note: Instructions need to be checked before
     * @param {Number} instructionType 
     * @param {String} instruction 
     */
    readInstructionRegValue() {

        let type = this.getInstructionType();
        let output = [];

        switch (type) {
            case 0:
                break;
            case 1:
                output.push(
                    this.register[this.currentInstruction[2]]
                );

                if (this.currentInstruction[3].charAt(0) !== '#')
                    output.push(
                        this.register[this.currentInstruction[3]]
                    );
                else
                    output.push(
                        parseInt(
                            this.currentInstruction[3].substring(1)
                        )
                    );
                
                break;
            case 2:
                output.push(
                    this.register[this.currentInstruction[1]]
                );

                let arg2 = this.currentInstruction[2];
                let arg3 = this.currentInstruction[3];
                arg2 = arg2.substring(1);

                if (arg2.charAt(arg2.length - 1) === ']')
                    arg2 = arg2.substring(0, arg2.length - 1);
                else if (arg3.charAt(arg3.length - 1) === ']')
                    arg3 = arg3.substring(0, arg3.length - 1);
                else
                    arg3 = arg3.substring(0, arg3.length - 2);
                
                output.push(
                    this.register[arg2]
                );

                if (arg3)
                    output.push(
                        this.register[arg3]
                    );

                break;
            case 3:
                // Too lazy to implement right now
                break;
            case 4:
                if (this.currentInstruction[2].charAt(0) !== '#')
                    output.push(
                        this.register[this.currentInstruction[2]]
                    );
                else
                    output.push(
                        parseInt(
                            this.currentInstruction[2].substring(1)
                        )
                    );
                break;
        }

        return output;
    }

    /**
     * 
     * @param {String} name 
     * @param {Number} value 
     */
    writeRegister(name, value) {
        this.register[name] = value;
    }
}

export default Decoder;