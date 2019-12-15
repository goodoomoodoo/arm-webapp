import { SET_REGISTER } from '../constants';

export const setRegister = ( payload ) => {
    /**
     * payload 
     * {
     *   id: 'register name'
     *   value: 'register value'
     * }
     */
    return { type: SET_REGISTER, payload }
};