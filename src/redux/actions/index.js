import { 
    SET_REGISTER, 
    SET_STACK,
    SET_CONSOLE_OUTPUT,
    SET_CONSOLE_INSTRUCTION } from '../constants';


export const setRegister = payload => {
    /**
     * payload 
     * {
     *   name:  String | Register name
     *   value: Number | Register value
     * }
     */
    return { type: SET_REGISTER, payload }
};

export const setStack = payload => {
    /**
     * payload
     * {
     *   block: Object{} | Memory block
     * }
     */
    return { type: SET_STACK, payload };
}

export const setConsoleOutput = payload => {
    /**
     * payload
     * {
     *   exitCode: Number | Exit code
     *   message:  String | Console message
     * }
     */
    return { type: SET_CONSOLE_OUTPUT, payload };
}

export const setConsoleInstruction = payload => {
    /**
     * payload
     * {
     *   exitCode: Number | Exit code
     *   message:  String | Console message
     * }
     */
    return { type: SET_CONSOLE_INSTRUCTION, payload }
}