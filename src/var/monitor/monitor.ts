import Register from './register/register';
import {REGISTER_NAME} from '../../sim/arch/arm/register';
import Simulation from '../../sim/simulation';

export default class Monitor {
    /**
     * Monitor container
     */

    register: Register;

    constructor(sim: Simulation) {
        this.register = new Register();
        
        /* Establish hook, register view changes when sim updates */
        sim.regCallBack = this.register.write;
        this.toggleDisplay = this.toggleDisplay.bind(this);

        sim.asmCallBack = this.toggleDisplay;

        this.setup = this.setup.bind(this);

        this.setup();
    }

    setup() {
        /* Mount register views */
        REGISTER_NAME.forEach((regName, index) => {
            this.register.create(regName);
        });

        /* Default to hide the register view */
        this.hideRegister();
    }

    toggleDisplay(isAssembled: boolean) {
        if (isAssembled) {
            this.hideConsole();
            this.showRegister();
        } else {
            this.hideRegister();
            this.showConsole();
        }
    }

    showRegister() {
        let regFileDiv = document.getElementById('debug-window');
        if (regFileDiv) regFileDiv.style.display = 'block';
    }

    hideRegister() {
        let regFileDiv = document.getElementById('debug-window');
        if (regFileDiv) regFileDiv.style.display = 'none';
    }

    showConsole() {

    }

    hideConsole() {

    }
}