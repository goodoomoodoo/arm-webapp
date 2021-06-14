import NavBar from './navbar/navbar';
import Register from './register/register';
import {REGISTER_NAME} from '../../sim/arch/arm/register';

export default class Monitor {
    /**
     * Monitor container
     */

    navbar: NavBar;
    register: Register;

    constructor() {
        this.navbar = new NavBar();
        this.register = new Register();

        this.setup = this.setup.bind(this);

        this.setup();
    }

    setup() {
        REGISTER_NAME.forEach((regName, index) => {
            this.register.create(regName);
        });
    }
}