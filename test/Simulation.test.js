import Simulation from '../src/js/Simulation';

describe('Simulation Simple Test', () => {

    it('Simulation step Simple Test 1', () => {

        let instruction = ['add r1, r2, r3'];
        let simulation = new Simulation(instruction);

        simulation.step();
    });

    it('Simulation step Simple Test 2', () => {

        let instruction = ['mov r1, #10'];
        let simulation = new Simulation(instruction);

        simulation.step();
    });
});

describe('Simulation Intermediate Test', () => {

    it('Simulation step Intermediate Test 1', () => {

        let instruction = ['mov r1, #10', 'mov r2, r1', 'mov r3, #8', 'add r1, r2, r3'];
        let simulation = new Simulation(instruction);

        simulation.step();
        simulation.step();
        simulation.step();
        simulation.step();
    });

    it('Simulation step Intermediate Test 2', () => {

        let instruction = ['mov r1, #10', 'mov r2, #2000', 'str r1, [r2]'];
        let simulation = new Simulation(instruction);

        simulation.step();
        simulation.step();
    });
});