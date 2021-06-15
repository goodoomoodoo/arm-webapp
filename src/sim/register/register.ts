import {REGISTER_NAME} from '../arch/arm/register'

export interface CallBackType {
    (regName: string, value: number): void
}

export interface RegisterFileObj {
    [prop: string]: number
}

export default class RegisterFile {
    /**
     * Register class is a container created based on the register configuration
     * inside 'arch/'. Each register element created is one to one to the
     * defined register in 'arch/'.
     */

    /* Class variable */
    block: RegisterFileObj;

    constructor() {
        this.block = {};

        for (let rname of REGISTER_NAME) {
            this.block[rname] = 0
        }
    }

    write(regName: string, value: number, callback: CallBackType) {
        this.block[regName] = value;
        callback(regName, value);
    }
}