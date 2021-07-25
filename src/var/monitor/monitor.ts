import Register from './register/register';
import {REGISTER_NAME} from '../../sim/arch/arm/register';
import Simulation from '../../sim/simulation';

export default class Monitor {
    /**
     * Monitor container
     */

    register: Register;
    isInit: boolean;

    constructor(sim: Simulation) {
        this.register = new Register();
        this.isInit = false;
        
        /* Establish hook, register view changes when sim updates */
        sim.regCallBack = this.register.write;
        this.toggleDisplay = this.toggleDisplay.bind(this);

        sim.asmCallBack = this.toggleDisplay;
        sim.errCallBack = this.renderError;

        this.setup = this.setup.bind(this);

        this.setup();
    }

    setup() {
        /* Mount register views */
        REGISTER_NAME.forEach((regName, index) => {
            this.register.create(regName);
        });

        /* Default to hide the register view */
        this.hideMonitor();
    }

    /**
     * Toggle monitor display based on assemble value
     * @param isAssembled whether if code has been compiled
     */
    toggleDisplay(isAssembled: boolean) {
        /* Remove placeholder if not yet */
        if (!this.isInit) {
            this.hidePlaceholder();
            this.showMonitor();
            this.isInit = true;
        }

        if (isAssembled) {
            this.hideConsole();
            this.showDebug();
        } else {
            this.hideDebug();
            this.showConsole();
        }
    }

    renderError(error: Error) {
        if (error) {
            let consoleDiv = document.getElementById('console');
            if (consoleDiv) {
                consoleDiv.innerHTML = error.message;
            }
        }
    }

    showMonitor() {
        let monitorDiv = document.getElementById('monitor');
        if (monitorDiv) monitorDiv.style.display = 'block';
    }

    hideMonitor() {
        let monitorDiv = document.getElementById('monitor');
        if (monitorDiv) monitorDiv.style.display = 'none';
    }

    showDebug() {
        let regFileDiv = document.getElementById('debug-window');
        if (regFileDiv) regFileDiv.style.display = 'block';
    }

    hideDebug() {
        let regFileDiv = document.getElementById('debug-window');
        if (regFileDiv) regFileDiv.style.display = 'none';
    }

    hidePlaceholder() {
        let phDiv = document.getElementById('if-placeholder');
        if (phDiv) phDiv.style.display = 'none';
    }

    showConsole() {

    }

    hideConsole() {

    }
}