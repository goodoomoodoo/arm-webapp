import {INSTR_TABLE} from '../arch/arm/instruction';
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
     * Note: Assembler will break each instruction into double string array. If
     *       the instruction can be broken down into subinstruction, then the
     *       double string array will contain multiple instruction vector.
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
        this.instrTable = INSTR_TABLE;
        this.labelTable = {} as any;
    }

    /**
     * Filter out the labels in the instruction and create label lookup table.
     * @param ambInstr Lines of assembly instructions
     * @returns Lookup Table of Labels to Line number
     */
    filterLabel(ambInstr: string[][][]): LUT {
        let labelTable: LUT = {} as any;

        for (let i = 0; i < ambInstr.length;) {

            /* First instruction name of the vector pointer should be label */
            let currInstr = ambInstr[i][0][0];

            if (currInstr.charAt(currInstr.length - 1) === ':') {
                let labelName = currInstr.substring(0, currInstr.length - 1);

                ambInstr.splice(i, 1);
                labelTable[labelName] = i;
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

        instruction = instruction.filter(instr => instr === '');

        return instruction;
    }

    /**
     * Validate the instructions, assemble instruction, break down instructions,
     * and return instruction double array.
     * @return 
     */
    assemble = async (): Promise<string[][][]> => {
        let trimmedInstr: string[] = this.trimInstruction(this.instruction);
        let asmInstr: string[][][] = [];

        for (let i = 0; i < trimmedInstr.length; i++) {
            let currInstr: string = trimmedInstr[i];

            /* Skip label or seperate label */
            if (currInstr.includes(':')) {
                let sep: string[] = currInstr.split(':');
                asmInstr = asmInstr.concat([[sep[1] + ':']]);
                
                if (sep[1] !== '') {
                    let argv: string[][] = 
                        await this.validateInstruction(sep[1]);
                    asmInstr.push(argv);
                }
            } else {
                let argv: string[][] = 
                    await this.validateInstruction(currInstr);
                asmInstr.push(argv);
            }
        }

        this.labelTable = this.filterLabel(asmInstr);

        return asmInstr;
    }

    /**
     * Validate the instructions based on the type of the instruction
     * @param instr
     */
    validateInstruction = async (instr: string): Promise<string[][]> => {
        let instrName: string = 
            await this.validateInstructionName(instr);
        let argv: string[][];
        
        switch (this.instrTable[instrName]) {
            case 0:
                argv = await this.validateTypeZeroInstruction(instr);
                break;
            case 1:
                argv = await this.validateTypeOneInstruction(instr);
                break;
            case 2:
                argv = await this.validateTypeTwoInstruction(instr);
                break;
            case 3:
                argv = await this.validateTypeThreeInstruction(instr);
                break;
            case 4:
                argv = await this.validateTypeFourInstruction(instr);
                break;
            default:
                return Promise.reject(new Error(
                    `Syntax Error: '${instrName}' argument not found.`
                ));
        }

        return argv;
    }

    /**
     * Validate the instruction name
     * Note: added guard to undefined value due to the design of the algorithm
     * @param instruction
     * @return
     */
    validateInstructionName(instruction: string): Promise<string> {
        let instructionName = this.getInstrName(instruction);

        return new Promise((resolve, reject) => {
            if (this.instrTable[instructionName] === undefined)
                reject(new Error(`Instruction ${instructionName} not found.`));
            else
                resolve(instructionName);
        });
    }

    /**
     * Validate the Type 0 instruction and return label's pc pointer
     * 
     * Note: Instruction name should be valid in this scope 
     * @param instr 
     * @return
     */
    validateTypeZeroInstruction(instr: string): Promise<string[][]> {
        let argv: string[] = this.getInstrArgv(instr);
        let labelName = argv[0];
        let instrName: string = this.getInstrName(instr);

        return new Promise((resolve, reject) => {
            if (instrName === 'bx') {
                // bx not yet implemented
                reject(new Error('BX is not yet supported.'));
            } else {
                let pc: number = this.lookup(labelName)

                if (pc < 0) {
                    reject(new Error(`Invalid label: ${labelName} not found`));
                } else {
                    resolve([[instrName, pc.toString()]]);
                }
            }
        });
    }

    /**
     * Validate, semi assemble type one instructions, and return instruction
     * vector
     * @param instr 
     * @return
     */
    validateTypeOneInstruction(instr: string): Promise<string[][]> {
        let argv: string[] = this.getInstrArgv(instr);
        let instrName: string = this.getInstrName(instr);

        return new Promise((resolve, reject) => {
            if (!checkIsRegister(argv[0])) {
                return reject(new Error(
                    `Invalid register name: expected register name but found ` +
                    `${argv[0]}.`
                ));
            }
            
            if (!checkIsRegister(argv[1])) {
                return reject(new Error(
                    `Invalid register name: expected register name but found ` +
                    `${argv[1]}.`
                ));
            }
                
            if (!checkIsRegister(argv[2]) &&
                !checkIsImmediate(argv[2])
            ) {
                return reject(new Error(
                    'Invalid argument: expected register name or immediate ' +
                    `value but found ${argv[2]}.`
                ));
            }

            if (checkIsImmediate(argv[2])) argv[2] = argv[2].substring(1);

            resolve([[instrName, ...argv]]);
        });
    }

    /**
     * Validate type two instruction and assemble the instruction.
     * 
     * e.g Pre index instruction gets break down into two instructions.
     * @param instr 
     * @return
     */
    validateTypeTwoInstruction(instr: string): Promise<string[][]> {
        let argv: string[] = this.getInstrArgv(instr);
        let instrName: string = this.getInstrName(instr);

        return new Promise((resolve, reject) => {
            if (!checkIsRegister(argv[0])) {
                return reject(new Error(
                    `Invalid register name: expected register name but found ` +
                    `${argv[0]}.`
                ));
            }

            if (argv[1] == undefined) {
                return reject(new Error(
                    'Invalid syntax: expect indexing with regsiter.'
                ));
            }

            /** Syntax Error: expect [ */
            if (argv[1].charAt(0) !== '[') {
                return reject(new Error(
                    'Invalid syntax: expected [ in the argument.'
                ));
            } else {
                /* Remove opening bracket */
                argv[1] = argv[1].substring(1);
            }

            let closed: boolean = false;
            let pre: boolean = false;
            let post: boolean = false;
            let currArgLastC: string = argv[1].charAt(argv[1].length - 1);

            /* Check first arg */
            if (currArgLastC === ']') {
                closed = true;
                argv[1] = argv[1].substring(0, argv[1].length - 1);
            } else if (currArgLastC === '!') {
                return reject(new Error(
                    'Invalid syntax: expect bracket to be closed before ' +
                    'preindex symbol'
                ));
            }

            if (!checkIsRegister(argv[1])) {
                return reject(new Error(
                    `Invalid syntax: expect a register but found ${argv[1]}`
                ));
            }
            
            /* Check second arg */
            if (argv[2] === undefined) {
                if (!closed) {
                    return reject(new Error(
                        'Invalid syntax: indexing bracket not closed'
                    ));
                } else {
                    return resolve([[instrName, ...argv]]);
                }
            } else if (pre) {
                return reject(new Error(
                    'Invalid syntax: no argument allowed after preindex'
                ));
            }

            if (closed) {
                if (!checkIsImmediate(argv[2])) {
                    return reject(new Error(
                        'Invalid syntax: expect indexing argument to be ' +
                        'immediate value'
                    ));
                } else {
                    post = true;
                }
            } else {
                currArgLastC = argv[2].charAt(argv[2].length - 1);

                if (currArgLastC === '!') {
                    pre = true;
                    argv[2] = argv[2].substring(0, argv[2].length - 1);
                    currArgLastC = argv[2].charAt(argv[2].length - 1);

                    if (currArgLastC === ']') {
                        closed = true;
                        argv[2] = argv[2].substring(0, argv[2].length - 1);
                    } else {
                        return reject(new Error(
                            'Invalid syntax: missing closing bracket.'
                        ));
                    }
                } else if (currArgLastC === ']') {
                    closed = true;
                    argv[2] = argv[2].substring(0, argv[2].length - 1);
                }
            }

            if (!checkIsImmediate(argv[2])) {
                return reject(new Error(
                    'Invalid syntax: expect indexing argument to be immediate' +
                    ' value'
                ));
            } else {
                argv[2] = argv[2].substring(1);
            }

            /* Check third argument */
            if (argv[3] === undefined) {
                if (closed) {
                    if (pre) {
                        return resolve([
                            ['add', argv[1], argv[1], argv[2]],
                            [instrName, argv[0], argv[1]]
                        ]);
                    } else if (post) {
                        return resolve([
                            [instrName, argv[0], argv[1]],
                            ['add', argv[1], argv[1], argv[2]]
                        ]);
                    } else {
                        return resolve([[instrName, ...argv]]);
                    }
                } else {
                    return reject(new Error(
                        'Invalid syntax: missing closing bracket'
                    ));
                }
            } else {
                return reject(new Error(
                    'Double word not supported.'
                ));
            }
        });
    }

    /**
     * Validate type three argument and return the reglist
     * @param instr 
     * @return
     */
    validateTypeThreeInstruction(instr: string): Promise<string[][]> {
        /** Register list range not supported */
        let argv: string[] = this.getInstrArgv(instr);
        let instrName: string = this.getInstrName(instr);
        let ambInstr: string[][] = [];

        return new Promise((resolve, reject) => {
            let lastArg: string = argv[argv.length - 1];
            let lastArgC: string = lastArg.charAt(lastArg.length - 1);

            if (argv[0].charAt(0) !== '{') {
                return reject(new Error(
                    'Invalid syntax: missing opening bracket for reglist'
                ));
            } else {
                /* Remove opening bracket */
                argv[0] = argv[0].substring(1);
            }

            if (lastArgC !== '}') {
                return reject(new Error(
                    'Invalid syntax: missing closing bracket for reglist'
                ));
            } else {
                /* Remove closing bracket */
                lastArg = argv[argv.length - 1];
                argv[argv.length - 1] = 
                    lastArg.substring(0, lastArg.length - 1);
            }

            for (let i = 0; i < argv.length; i++) {
                if (!checkIsRegister(argv[i])) {
                    return reject(new Error(
                        `Invalid syntax: expect a register but found ${argv[i]}`
                    ));
                } else if (instrName === 'push') {
                    ambInstr = ambInstr.concat([
                        ['str', argv[i], 'sp'],
                        ['add', 'sp', 'sp', '4'] 
                    ]);
                } else if (instrName === 'pop') {
                    ambInstr = ambInstr.concat([
                        ['ldr', argv[i], 'sp'],
                        ['sub', 'sp', 'sp', '4']
                    ]);
                }
            }

            return resolve(ambInstr);
        })
    }

    /**
     * Validate type four argument and return argument vector
     * @param instr 
     * @return
     */
    validateTypeFourInstruction(instr: string): Promise<string[][]> {
        let argv: string[] = this.getInstrArgv(instr);
        let instrName: string = this.getInstrName(instr)

        return new Promise((resolve, reject) => {
            if (!checkIsRegister(argv[0])) {
                return reject(new Error(
                    `Invalid register name: expected register name but found ` +
                    `${argv[0]}.`
                ));
            }

            if (!checkIsRegister(argv[1]) &&
                !checkIsImmediate(argv[1])) {
                return reject(new Error(
                    `Invalid syntax: expected a register or an immediate ` + 
                    `value but found ${argv[1]}.`
                ));
            }

            /* Remove immediate value sentinel */
            if (checkIsImmediate(argv[1])) {
                argv[1] = argv[1].substring(1);
            }

            return resolve([[instrName, ...argv]]);
        });
    }

    /**
     * Returns first string of the instruction and trim all white spaces 
     * and tabs
     * @param instruction 
     */
    getInstrName(instruction: string): string {
        let instructionName = instruction.trim().split(/[\s\t]+/)[0];
        return instructionName;
    }

    /**
     * Separate the instruction into array of arguments
     * @param instruction 
     * @return array of arguments
     */
    getInstrArgv(instruction: string): string[] {
        let idx: number = instruction.search(/[ \t\n]/);
        let args: string = '';

        if (idx > 0) {
            args = instruction.substring(idx + 1);
            args = args.replace(/[ \t\n]+/g, '');
        }

        let argv: string[] = args.split(',');

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
}


/**
 * Check if the input string is a register
 * @param {String} arg 
 */
export function checkIsRegister(arg: string): boolean {
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
export function checkIsImmediate(arg: string): boolean {
    if (arg.charAt(0) === '#') {
        let num = arg.substring(1, arg.length);

        /* TODO: Include support for binary and hex */
        return /^([-+]?[1-9]\d*)$|^0$/.test(num);
    }

    return false;
}