import Memory from '../src/js/Memory';

describe('Memory Simple Test', () => {
    let memory = new Memory();

    it('Memory blockToNum Simple Test', () => {

        let result = memory.blockToNum([0, 0, 1, 0]);

        expect(result).toBe(16);
    });

    it('Memory numToBlock Simple Test', () => {

        let result = memory.numToBlock(100);

        expect(result).toEqual([0, 0, 6, 4]);
    })
});