import { SET_REGISTER, PROC_STACK } from '../constants';


export const setRegister = payload => {
    /**
     * payload 
     * {
     *   id: 'register name'
     *   value: 'register value'
     * }
     */
    return { type: SET_REGISTER, payload }
};

export const procStack = payload => {
    /**
     * payload
     * {
     *   addr: 'memory location offset'
     *   value: 'value to be store'
     * }
     */
    return { type: PROC_STACK, payload };
}