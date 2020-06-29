import Simulation from '../src/js/Simulation';

describe('Simulation Simple Test', () => {

    it('Simluation walk through test', () => {

        let instruction = [
            'mov r1, #10',
            'mov r2, r1',
            'add r1, r1, r2',
            'str r1, [r2]',
            'ldr r3, [r2]'
        ];

        let simulation = new Simulation(instruction);

        simulation.assemble()
            .then(() => {
                simulation.step();
                simulation.step();
                simulation.step();
                simulation.step();
                simulation.step();
            });
    })
});
