import labelLUT from './labelLUT';
import {REGISTER_NAME, INSTR_TYPE} from './constants';

class Assembler {
    
    /**
     * Constructor of Assembler
     * @param {String[]} instruction 
     */
    constructor(instruction) {
        this.lut = new labelLUT(instruction);
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

        for (let i = 0; i < instruction.length; i++) {

            instruction[i] = instruction[i].trim();
        }

        return instruction;
    }

    validate() {

        let labelessInstruction = this.lut.getLabelessInstruction();
        let trimmedInstruction = this.trimInstruction(labelessInstruction);

        for (let i = 0; i < trimmedInstruction.length; i++) {

            let currentInstruction = trimmedInstruction[i];

            /** Note: Type validation should be run after name validation */
        }
    }

    /**
     * 
     * @param {String} instruction 
     */
    validateInstructionName(instruction) {

        let instructionName = this.getInstructionName(instruction);

        return new Promise((resolve, reject) => {
            if (this.instructionLUT[instructionName] === undefined)
                reject(new Error(`Instruction ${instructionName} not found.`));
            else
                resolve(instructionName);
        });
    }

    /**
     * Validate the Type 0 instruction and return label name
     * @param {String} instruction 
     */
    validateTypeZeroInstruction(instruction) {

        let argv = this.getInstructionArgs(instruction);
        let args = argv[0];

        let instructionName = this.getInstructionName(instruction);

        return new Promise((resolve, reject) => {

            if (instructionName === 'bx') {

                // bx not yet implemented
                reject(new Error('BX is not yet supported.'));

            } else if (this.lookup(args) === -1) {
    
                reject(new Error(`Invalid label: ${args} not found`));

            } else {

                resolve(args);
            }
        });
    }

    validateTypeOneInstruction(instruction) {

        let argv = this.getInstructionArgs(instruction);

        return new Promise((resolve, reject) => {

            if (this.checkIsRegister(argv[0])) {

                if (this.checkIsRegister(argv[1])) {

                    if (this.checkIsRegister(argv[2])) {
                        resolve(argv);
                    } else if (this.checkIsImmediate(argv[2])) {
                        resolve(argv);
                    } else {
                        reject(new Error('Invalid argument: expected register'
                            + `name or immediate value but found ${argv[2]}.`));
                    }

                } else {
                    reject(new Error(`Invalid register name: expected register`
                        + ` name but found ${argv[1]}.`));
                }

            } else {
                reject(new Error(`Invalid register name: expected register name`
                    + ` but found ${argv[0]}.`));
            }
        })
    }

    validateTypeTwoInstruction(instruction) {

        let argv = this.getInstructionArgs(instruction);

        return new Promise((resolve, reject) => {

            if (this.checkIsRegister(argv[0])) {

                if (argv[1].charAt(0) === '[') {

                    /** Register is closed and no offset expected */
                    if (argv[1].charAt(argv[1].length - 1) === ']') {
                        
                        argv[1] = argv[1].substring(1, argv[1].length - 2);

                        resolve(argv);
                    }
                    /** Register is not closed, expect an offset */
                    else if (argv[2] !== undefined && 
                            argv[2].charAt(argv[2].length - 1) === ']') {
                        
                        argv[1] = argv[1].substring(1, argv[1].length - 1);
                        argv[2] = argv[2].substring(0, argv[2].length - 2);
                        
                        resolve(argv);

                    } else {
                        reject(new Error('Invalid syntax: no offset found, '
                            + 'expected ] in the argument.'));
                    }

                } else {
                    reject(new Error('Invalid syntax: expected [ in the '
                        + 'argument.'))
                }

            } else {
                reject(new Error(`Invalid register name: expected register name`
                    + ` but found ${argv[0]}.`));
            }
        });
    }

    /**
     * Returns first string of the instruction and trim all white spaces 
     * and tabs
     * @param {String} instruction 
     */
    getInstructionName(instruction) {

        let instructionName = instruction.trim().split(' ')[0];

        return instructionName;
    }

    /**
     * 
     * @param {String} instruction 
     */
    getInstructionArgs(instruction) {

        let args = instruction
            .substring(instruction.indexOf(' ') + 1);
        args = args.replace(/\s/g, '');

        let argv = args.split(',');

        return argv;
    }

    /**
     * 
     * @param {String} label 
     */
    lookup(label) {
        return this.lut.lookup(label);
    }

    /**
     * Check if the input string is a register
     * @param {String} arg 
     */
    checkIsRegister(arg) {

        REGISTER_NAME.forEach(registerName => {
            if (arg === registerName)
                return true;
        });

        return false;
    }

    /**
     * Check if the input string is and immediate value
     * @param {String} arg 
     */
    checkIsImmediate(arg) {

        if (arg.charAt(0) === '#') {
            let num = arg.substring(1, arg.length);

            if (/^([-+]?[1-9]\d*)$|^0$/.test(num))
                return true;

            return false;
        }

        return false;
    }
}

export default Assembler;