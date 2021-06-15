export default class Register {
    /**
     * Register container
     */
    constructor() {}

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

    write(regName: string, value: number) {
        let regValDiv = document.getElementById(`register-${regName}`);
        
        if (regValDiv) {
            regValDiv.innerHTML = value.toString();
        }
    }
}