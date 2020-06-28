import ALU from '../src/js/ALU';

describe('ALU Simple Test', () => {
    let alu = new ALU();

    it('ALU Type One EOR Simple Test', () => {

        let result0 = alu.executeTypeOne('eor', [0, 1]);

        expect(result0).toBe(1);
    })
});