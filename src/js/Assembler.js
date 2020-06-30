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
     * @return {String[]}
     */
    getPureInstruction() {
        let labelessInstruction = this.lut.getLabelessInstruction();
        return this.trimInstruction(labelessInstruction);
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

    /**
     * @return {String[][]}
     */
    validate = async () => {

        let trimmedInstruction = this.getPureInstruction();
        let assembledInstruction = [];

        for (let i = 0; i < trimmedInstruction.length; i+=3) {

            try {
                let instruction1 = trimmedInstruction[i];
                let instruction2 = trimmedInstruction[i + 1];
                let instruction3 = trimmedInstruction[i + 2];

                let argAll = [];

                argAll.push(
                    this.validateInstruction(instruction1)
                );

                if (instruction2)
                    argAll.push(
                        this.validateInstruction(instruction2)
                    );

                if (instruction3)
                    argAll.push(
                        this.validateInstruction(instruction3)
                    );

                let argv = await Promise.all(argAll);

                assembledInstruction =
                        assembledInstruction.concat(argv);

            } catch (error) {
                throw error;
            }
        }

        return assembledInstruction;
    }

    /**
     * 
     * @param {String} instruction
     */
    validateInstruction = async instruction => {

        try {
            let instructionName = await 
                this.validateInstructionName(instruction);

            let instructionArg = undefined;

            
            switch (this.instructionLUT[instructionName]) {
                case 0:
                    instructionArg = await
                        this.validateTypeZeroInstruction(instruction);
                    break;
                case 1:
                    instructionArg = await
                        this.validateTypeOneInstruction(instruction);
                    break;
                case 2:
                    instructionArg = await
                        this.validateTypeTwoInstruction(instruction);
                    break;
                case 3:
                    instructionArg = await
                        this.validateTypeThreeInstruction(instruction);
                    break;
                case 4:
                    instructionArg = await
                        this.validateTypeFourInstruction(instruction);
                    break;
                default:
                    break;
            }

            instructionArg.splice(0, 0, instructionName);

            return instructionArg;

        } catch (error) {
            throw error;
        }
    }

    /**
     * Validate the instruction name
     * Note: added guard to undefined value due to the design of the algorithm
     * @param {String} instruction
     * @return {Promise<String>}
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
     * @return {Promise<String[]>}
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

    /**
     * 
     * @param {String} instruction 
     * @return {Promise<String[]>}
     */
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

    /**
     * 
     * @param {String} instruction 
     * @return {Promise<String[]>}
     */
    validateTypeTwoInstruction(instruction) {

        let argv = this.getInstructionArgs(instruction);

        return new Promise((resolve, reject) => {

            if (!this.checkIsRegister(argv[0])) {
                return reject(new Error(`Invalid register name: expected `
                    + `register name but found ${argv[0]}.`));
            }

            /** Syntax Error: expect [ */
            if (!argv[1].charAt(0) === '[') {
                return reject(new Error('Invalid syntax: expected [ in the '
                    + 'argument.'));
            }

            /** Bracket is closed after opened [ ] */
            if (argv[1].charAt(argv[1].length - 1) === ']') {

                let arg1 = argv[1].substring(1, argv[1].length - 1);

                /** Arg1 is not a register */
                if (!this.checkIsRegister(arg1)) {
                    return reject(new Error(`Invalid register name: expected `
                         + `register name but found ${arg1}.`));
                }
                
                /** Regular register */
                if (argv[2] === undefined)
                    return resolve(argv);
                /** Post indexed operation */
                else if (this.checkIsImmediate(argv[2]))
                    return resolve(argv);
                else
                    return reject(new Error('Invalid syntax: expected offset'
                        + ' to be immediate value.'));

            }

            /** Bracket is not closed properly */
            if (argv[2] === undefined) {
                return reject(new Error('Invalid syntax: no offset found, '
                    + 'expected ] in the argument.'));
            }
            
            /** Register is not closed, expect an offset */
            if (argv.length < 4) {
                
                let arg2 = argv[2];
                let lastChar = arg2.charAt(argv[2].length - 1);

                /** Offset operation */
                if (lastChar === ']') {

                    arg2 = arg2.substring(0, arg2.length - 1);

                    if (this.checkIsImmediate(arg2) 
                        || this.checkIsRegister(arg2))
                        return resolve(argv);
                    else
                        return reject(new Error('Invalid syntax: immediate '
                            + `value or register expected but found ${arg2}.`));
                }
                /** Pre indexed operation */
                else if (lastChar === '!') {
                    
                    if (arg2.charAt(argv[2].length - 2) === ']') {

                        arg2 = arg2.substring(0, arg2.length - 2);

                        return this.checkIsRegister(arg2)
                            || this.checkIsImmediate(arg2) 
                            ? resolve(argv)
                            : reject(new Error('Invalid syntax: immediate '
                            + `value or register expected but found ${arg2}.`));
                    }

                } else {
                    return reject(new Error('Invalid syntax: unable to resolve'
                        + `${arg2}`));
                }
            } 

        });
    }

    /**
     * 
     * @param {String} instruction 
     * @return {Promise<String[]>}
     */
    validateTypeThreeInstruction(instruction) {

        /** Register list range not supported */
        
        let argv = this.getInstructionArgs(instruction);

        return new Promise((resolve, reject) => {

            let firstChar = argv[0].charAt(0);
            let lastArg = argv[argv.length - 1];
            let lastChar = lastArg.charAt(lastArg.length - 1);

            if (firstChar !== '{') {
                return reject(new Error('Invalid syntax: register list should'
                    + 'start with {'));
            }

            if (lastChar !== '}') {
                return reject(new Error('Invalid syntax: register list should'
                    + 'be closed with }'));
            }

            argv[0] = argv[0].substring(1);
            lastArg = argv[argv.length - 1];
            argv[argv.length - 1] = lastArg
                                    .substring(0, lastArg.length - 1);

            argv.forEach(arg => {

                if (!this.checkIsRegister(arg)) {
                    return reject(new Error(`Invalid register name: expected `
                        + `register name but found ${arg}.`));
                }
            });

            return resolve(argv);
        })
    }

    /**
     * 
     * @param {String} instruction 
     * @return {Promise<String[]>}
     */
    validateTypeFourInstruction(instruction) {

        let argv = this.getInstructionArgs(instruction);

        return new Promise((resolve, reject) => {

            if (!this.checkIsRegister(argv[0])) {
                return reject(new Error(`Invalid register name: expected `
                    + `register name but found ${argv[0]}.`));
            }

            if (!this.checkIsRegister(argv[1])
                && !this.checkIsImmediate(argv[1])) {
                return reject(new Error(`Invalid syntax: expected a `
                    + `register or an immediate value but found ${argv[1]}.`));
            } 

            return resolve(argv);
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

        let found = false;

        REGISTER_NAME.forEach(registerName => {
            if (arg === registerName)
                found = true;
        });

        return found;
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