import ALU from '../src/js/ALU';

describe('ALU Simple Test', () => {
    let alu = new ALU();

    it('ALU Immediate Type One ADD Simple Test', () => {

        let result0 = alu.executeImmediateTypeOne({
            name: 'add',
            rd: 'r1',
            rSrc: 10,
            immd: 5
        });

        expect(result0).toBe(15);


        let result1 = alu.executeImmediateTypeOne({
            name: 'add',
            rd: 'r1',
            rSrc: -60,
            immd: 20
        });

        expect(result1).toBe(-40);

        let result2 = alu.executeImmediateTypeOne({
            name: 'add',
            rd: 'r1',
            rSrc: -1,
            immd: 100
        });

        expect(result2).toBe(99);
    });

    it('ALU Immediate Type One EOR Simple Test', () => {

        let result0 = alu.executeImmediateTypeOne({
            name: 'eor',
            rd: 'r1',
            rSrc: 1,
            immd: 0
        });

        expect(result0).toBe(1);
    })
});