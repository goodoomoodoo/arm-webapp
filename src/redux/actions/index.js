import { 
    SET_REGISTER, 
    SET_STACK,
    SET_CONSOLE_OUTPUT,
    SET_CONSOLE_INSTRUCTION } from '../constants';


export const setRegister = payload => {
    /**
     * payload 
     * {
     *   id: 'register name'
     *   value: 'register value'
     * }
     */
    console.log( "set register" );
    return { type: SET_REGISTER, payload }
};

export const setStack = payload => {
    /**
     * payload
     * {
     *   addr: 'memory location offset'
     *   value: 'value to be store'
     * }
     */
    return { type: SET_STACK, payload };
}

export const setConsoleOutput = payload => {
    /**
     * payload
     * {
     *   exitCode: exit value
     *   msgArr: 'array of error message'
     * }
     */
    return { type: SET_CONSOLE_OUTPUT, payload };
}

export const setConsoleInstruction = payload => {
    /**
     * payload
     * {
     *   instr: current instruction
     * }
     */
    return { type: SET_CONSOLE_INSTRUCTION, payload }
}