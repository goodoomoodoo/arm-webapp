import labelLUT from '../src/js/labelLUT';

describe('Label Lookup Table Simple Test', () => {
    
    it('Label Lookup Table build Simple Test 1', () => {
        
        let instruction = ['mov r1, r2', 'loop: add r1, r1, #2'];
        let lut = new labelLUT(instruction);

        expect(lut.getLabelessInstruction())
            .toEqual(['mov r1, r2', 'add r1, r1, #2']);
    });

    it('Label Lookup Table build Simple Test 2', () => {

        let instruction = ['mov r1, r2', 'loop: ', 'add r1, r1, #2'];

        let lut = new labelLUT(instruction);

        expect(lut.getLabelessInstruction())
            .toEqual(['mov r1, r2', 'add r1, r1, #2']);
    });
})