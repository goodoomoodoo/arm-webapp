import NavBar from './navbar/navbar';
import Register from './register/register';
import {REGISTER_NAME} from '../../sim/arch/arm/register';
import Simulation from '../../sim/simulation';

export default class Monitor {
    /**
     * Monitor container
     */

    navbar: NavBar;
    register: Register;

    constructor(sim: Simulation) {
        this.navbar = new NavBar();
        this.register = new Register();
        
        /* Establish hook, register view changes when sim updates */
        sim.regCallBack = this.register.write;

        this.setup = this.setup.bind(this);

        this.setup();
    }

    setup() {
        /* Mount register views */
        REGISTER_NAME.forEach((regName, index) => {
            this.register.create(regName);
        });
    }
}