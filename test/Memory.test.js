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
    });

    it('Memory write Simple Test 1', () => {

        memory.write(4000, 100);
    });

    it('Memory write Simple Test 2', () => {
        
        memory.write(4003, 422);
    })

    it('Memory read Simple test 1', () => {

        let result = memory.read(4000);

        expect(result).toBe(96);
    });

    it('Memory read Simple Test 2', () => {

        let result = memory.read(4003);

        expect(result).toBe(422);
    })
});