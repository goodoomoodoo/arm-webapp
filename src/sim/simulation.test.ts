import Simulation from './simulation';

describe('Simulation Sanity Test', () => {
    it('Assembly Test', async () => {
        let instr: string[] = [
            'mov r1, #10',
            'add r3, r1, r2',
            'str r1, [r3, #10]',
            'cmp r1, r3'
        ];

        let sim: Simulation = new Simulation(instr);

        await sim.assemble();
    });

    it('Step Test', async () => {
        let instr: string[] = [
            'mov r1, #10',
            'add r3, r1, r2',
            'str r1, [r3, #10]!',
            'cmp r1, r3'
        ];

        let sim: Simulation = new Simulation(instr);

        await sim.assemble();

        expect(sim.decoder.currInstr).toStrictEqual([['mov', 'r1', '10']]);
        expect(sim.decoder.currInstr.length).toBe(1);

        sim.step();

        expect(sim.regFile.block.r1).toBe(10);
        expect(sim.decoder.currInstr).toStrictEqual([
            ['add', 'r3', 'r1', 'r2']
        ]);
        expect(sim.decoder.currInstr.length).toBe(1);

        sim.step();

        expect(sim.regFile.block.r3).toBe(10);

        expect(sim.decoder.currInstr.length).toBe(2);

        sim.step();

        expect(sim.regFile.block.r3).toBe(20);
        expect(sim.memFile.read(20)).toBe(10);
    });
});