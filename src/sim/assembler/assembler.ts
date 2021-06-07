import {INSTRUCTION} from '../arch/arm/instruction';
import {REGISTER_NAME} from '../arch/arm/register';

export interface LUT {
    [prop: string]: any
}

export default class Assembler {
    /**
     * Assembler class validates the assembly code and reformat the instruction
     * strings into distinguishable elements - instruction name, register, and
     * label.
     * 
     */

    /* Class variable */
    instrTable: LUT;
    labelTable: LUT;
    instruction: string[];

    /**
     * Constructor of Assembler
     * @param instruction 
     */
     constructor(instruction: string[]) {
        this.instruction = instruction;
        this.instrTable = this.buildInstrMap();
        this.labelTable = {} as any;
    }

    /**
     * build function
     * Build a lookup table of instruction that maps instruction name to
     * instruction type.
     */
    buildInstrMap(): LUT {
        let instrTable: LUT = {} as any;

        for (let [type, instrNames] of Object.entries(INSTRUCTION)) {
            for (let instrName of instrNames) {
                instrTable[instrName] = parseInt(type);
            }
        }

        return instrTable;
    }

    /**
     * Filter out the labels in the instruction and create label lookup table.
     * @param instruction Lines of assembly instructions
     * @returns Lookup Table of Labels to Line number
     */
    filterLabel(instruction: string[]): LUT {
        let labelTable: LUT = {} as any;

        for (let i = 0; i < instruction.length;) {

            let currentInstruction = instruction[i];

            let index = currentInstruction.search(':');

            if (index !== -1) {
                let labelName = currentInstruction.substring(0, index);
                let newInstruction = currentInstruction.substring(index + 1);
                
                /* Check if the line might contains instruction */
                if (/\S/.test(newInstruction)) {

                    instruction[i] = newInstruction.trim();
                    labelTable[labelName] = i++;

                }
                /* This line do not contain instruction */
                else {

                    /** Remove the label line */
                    instruction.splice(i, 1);
                    labelTable[labelName] = i;
                }
            } else {
                i++;
            }
        }

        return labelTable;
    }

    /**
     * Remove empty line, whitespaces, and tabs
     * @param instruction 
     * @return 
     */
    trimInstruction(instruction: string[]): string[] {
        for (let i = 0; i < instruction.length; i++) {
            instruction[i] = instruction[i].trim();
        }

        return instruction;
    }

    /**
     * Validate the instructions and return array of distinct instruction
     * @return {String[][]}
     */
    assemble = async () => {
        this.labelTable = this.filterLabel(this.instruction);
        let trimmedInstruction: string[] = this.trimInstruction(this.instruction);
        let assembledInstruction: Array<string[]> = [];

        for (let i = 0; i < trimmedInstruction.length; i++) {
            let currInstr = trimmedInstruction[i];
            let argv: string[] = await this.validateInstruction(currInstr);

            assembledInstruction = assembledInstruction.concat(argv);
        }

        return assembledInstruction;
    }

    /**
     * Validate the instructions based on the type of the instruction
     * @param instruction
     */
    validateInstruction = async (instruction: string): Promise<string[]> => {
        let instrName: string = 
            await this.validateInstructionName(instruction);
        let instrArgv: string[];
        
        switch (this.instrTable[instrName]) {
            case 0:
                instrArgv = await
                    this.validateTypeZeroInstruction(instruction);
                break;
            case 1:
                instrArgv = await
                    this.validateTypeOneInstruction(instruction);
                break;
            case 2:
                instrArgv = await
                    this.validateTypeTwoInstruction(instruction);
                break;
            case 3:
                instrArgv = await
                    this.validateTypeThreeInstruction(instruction);
                break;
            case 4:
                instrArgv = await
                    this.validateTypeFourInstruction(instruction);
                break;
            default:
                return Promise.reject(new Error(
                    "Syntax Error: no argument found."
                ));
                break;
        }

        instrArgv.splice(0, 0, instrName);

        return instrArgv;
    }

    /**
     * Validate the instruction name
     * Note: added guard to undefined value due to the design of the algorithm
     * @param instruction
     * @return
     */
    validateInstructionName(instruction: string): Promise<string> {
        let instructionName = this.getInstructionName(instruction);

        return new Promise((resolve, reject) => {
            if (this.instrTable[instructionName] === undefined)
                reject(new Error(`Instruction ${instructionName} not found.`));
            else
                resolve(instructionName);
        });
    }

    /**
     * Validate the Type 0 instruction and return label's pc pointer
     * @param instruction 
     * @return
     */
    validateTypeZeroInstruction(instruction: string): Promise<string[]> {
        let argv: string[] = this.getInstrArgv(instruction);
        let args = argv[0];
        let instructionName: string = this.getInstructionName(instruction);

        return new Promise((resolve, reject) => {
            if (instructionName === 'bx') {
                // bx not yet implemented
                reject(new Error('BX is not yet supported.'));
            } else {
                let pc: number = this.lookup(args)

                if (pc < 0) {
                    reject(new Error(`Invalid label: ${args} not found`));
                } else {
                    resolve([pc.toString()]);
                }
            }
        });
    }

    /**
     * Validate and semi assemble type one instructions
     * @param instruction 
     * @return
     */
    validateTypeOneInstruction(instruction: string): Promise<string[]> {
        let argv: string[] = this.getInstrArgv(instruction);

        return new Promise((resolve, reject) => {
            if (!this.checkIsRegister(argv[0])) {
                return reject(new Error(
                    `Invalid register name: expected register name but found ` +
                    `${argv[0]}.`
                ));
            }
            
            if (!this.checkIsRegister(argv[1])) {
                return reject(new Error(
                    `Invalid register name: expected register name but found ` +
                    `${argv[1]}.`
                ));
            }
                
            if (!this.checkIsRegister(argv[2]) &&
                !this.checkIsImmediate(argv[2])
            ) {
                return reject(new Error(
                    'Invalid argument: expected register name or immediate ' +
                    `value but found ${argv[2]}.`
                ));
            }

            if (this.checkIsImmediate(argv[2])) argv[2] = argv[2].substring(1);

            resolve(argv);
        });
    }

    /**
     * Validate type two instruction and semi assemble the instruction
     * @param instruction 
     * @return
     */
    validateTypeTwoInstruction(instruction: string): Promise<string[]> {
        let argv: string[] = this.getInstrArgv(instruction);

        return new Promise((resolve, reject) => {
            if (!this.checkIsRegister(argv[0])) {
                return reject(new Error(
                    `Invalid register name: expected register name but found ` +
                    `${argv[0]}.`
                ));
            }

            /** Syntax Error: expect [ */
            if (argv[1].charAt(0) !== '[') {
                return reject(new Error(
                    'Invalid syntax: expected [ in the argument.'
                ));
            }

            /** Bracket is closed in the first argument */
            if (argv[1].charAt(argv[1].length - 1) === ']') {
                let arg1 = argv[1].substring(1, argv[1].length - 1);

                /** Arg1 is not a register */
                if (!this.checkIsRegister(arg1)) {
                    return reject(new Error(
                        `Invalid register name: expected register name but ` +
                        `found ${arg1}.`
                    ));
                }
                
                /* Regular register */
                if (argv[2] === undefined) {
                    return resolve(argv);
                } /*Post indexed operation, immediate value expected */
                else if (this.checkIsImmediate(argv[2])) {
                    /* Remove sentinol */
                    argv[2] = argv[2].substring(1);
                    return resolve(argv);
                } else {
                    return reject(new Error(
                        'Invalid syntax: expected offset to be immediate value.'
                    ));
                }
            }

            /* Bracket is not closed properly */
            if (argv[2] === undefined) {
                return reject(new Error(
                    'Invalid syntax: no offset found, expected ] in the ' +
                    'argument.'
                ));
            }
            
            /* Variable i keeps track of the iteration*/
            let i: number = 2;

            /* Preindex check */
            for (; i < argv.length; i++) {
                let currArg: string = argv[i];
                let currLastC: string = currArg.charAt(currArg.length - 1);

                if (currLastC === ']') {
                    let arg: string = currArg.substring(0, currArg.length - 1);

                    if (this.checkIsImmediate(arg)) {
                        argv[i] = currArg.substring(1);
                    } else if (!this.checkIsRegister(arg)) {
                        return reject(new Error(
                            `Invalid syntax: immediate value or register ` +
                            `expected but found ${arg}`
                        ));
                    }

                    break;
                } /* Preindexed operation */
                else if (currLastC === '!') {
                    if (currArg.charAt(argv[2].length - 2) === ']') {
                        let arg: string = 
                            currArg.substring(0, currArg.length - 2);
                        
                        if (this.checkIsImmediate(arg)) {
                            argv[i] = currArg.substring(1);
                        } else if (!this.checkIsRegister(arg)) {
                            return reject(new Error(
                                `Invalid syntax: immediate value or register ` +
                                `expected but found ${arg}`
                            ));
                        }

                        break;
                    } else {
                        return reject(new Error(
                            "Invalid syntax: '!' should not appear before ']'"
                        ));
                    }
                }
            }
            
            /* Post index check, 1 or 0 immedate value expected */
            if (argv[i] === undefined || this.checkIsImmediate(argv[i])) {
                resolve(argv);
            } else {
                reject(new Error(
                    'Invalid syntax: post index can only be immedaite value'
                ));
            }
        });
    }

    /**
     * 
     * @param instruction 
     * @return
     */
    validateTypeThreeInstruction(instruction: string): Promise<string[]> {
        /** Register list range not supported */
        let argv = this.getInstrArgv(instruction);

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
     * @param instruction 
     * @return
     */
    validateTypeFourInstruction(instruction: string): Promise<string[]> {

        let argv = this.getInstrArgv(instruction);

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
     * @param instruction 
     */
    getInstructionName(instruction: string): string {
        let instructionName = instruction.trim().split(' ')[0];
        return instructionName;
    }

    /**
     * Separate the instruction into array of arguments
     * @param instruction 
     * @return array of arguments
     */
    getInstrArgv(instruction: string): string[] {
        let args = instruction.substring(instruction.indexOf(' ') + 1);
        args = args.replace(/\s/g, '');

        let argv = args.split(',');

        return argv;
    }

    /**
     * Verify if the label exists in the label table
     * @param label 
     */
    lookup(inLabel: string): number {
        if (inLabel in this.labelTable) return this.labelTable[inLabel];
        return -1;
    }

    /**
     * Check if the input string is a register
     * @param {String} arg 
     */
    checkIsRegister(arg: string): boolean {
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
    checkIsImmediate(arg: string): boolean {
        if (arg.charAt(0) === '#') {
            let num = arg.substring(1, arg.length);

            /* TODO: Include support for binary and hex */
            return /^([-+]?[1-9]\d*)$|^0$/.test(num);
        }

        return false;
    }
}