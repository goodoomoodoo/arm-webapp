class labelLUT {

    /**
     * 
     * @param {String[]} instruction 
     */
    constructor(instruction) {
        this.LUT = {}

        this.newInstruction = this.build(instruction);
    }

    /**
     * 
     * @param {String[]} instruction 
     */
    build(instruction) {
        for (let i = 0; i < instruction.length; i++) {

            let currentInstruction = instruction[i];

            let index = currentInstruction.search(':');

            if (index !== -1) {
                let labelName = currentInstruction.substring(0, index);
                let newInstruction = currentInstruction.substring(index + 1,
                    currentInstruction.length);
                
                /** Check if the line might contains instruction */
                if (/\S/.test(newInstruction)) {

                    instruction[i] = newInstruction.trim();
                    this.LUT[labelName] = i;

                }
                /** This line do not contain instruction */
                else {

                    /** Remove the label line */
                    instruction.splice(i, 1);
                    this.LUT[labelName] = i;
                }
            }
        }


        return instruction;
    }

    getLabelessInstruction() {
        return this.newInstruction;
    }

    lookup(label) {
        if (this.LUT[label]) {
            return this.LUT[label];
        }
        return -1;
    }
}

export default labelLUT;