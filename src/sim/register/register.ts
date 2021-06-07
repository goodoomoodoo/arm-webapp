import {REGISTER_NAME} from '../arch/arm/register'

export interface RegisterBlock {
    [prop: string]: Number
}

export class Register {
    /**
     * Register class is a container created based on the register configuration
     * inside 'arch/'. Each register element created is one to one to the
     * defined register in 'arch/'.
     */

    /* Class variable */
    block: RegisterBlock;

    constructor() {
        this.block = {};

        for (let rname of REGISTER_NAME) {
            this.block[rname] = 0
        }
    }
}