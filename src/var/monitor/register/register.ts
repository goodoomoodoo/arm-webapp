export default class Register {
    /**
     * Register container
     */
    constructor() {}

    /**
     * Create a new register HTML element in DOM
     * @param regName Register name
     */
    create(regName: string) {
        let regFileDiv = document.getElementById('monitor-register');
        let newReg = document.createElement('div');
        newReg.classList.add('Registerblock');

        let newRegLabel = document.createElement('div');
        newRegLabel.innerHTML = regName;

        let newRegValue = document.createElement('div');
        newRegValue.classList.add('Registerblock-val');
        newRegValue.setAttribute('id', `register-${regName}`);
        newRegValue.innerHTML = '0';

        newReg.appendChild(newRegLabel);
        newReg.appendChild(newRegValue);

        regFileDiv?.appendChild(newReg);
    }

    /**
     * Change the register HTML element value
     * @param regName Register name
     * @param value New value
     */
    write(regName: string, value: number) {
        let regValDiv = document.getElementById(`register-${regName}`);
        
        if (regValDiv) {
            regValDiv.innerHTML = value.toString();
        }
    }
}