import Decoder from '../src/js/Decoder';

describe('Decoder Simple Test', () => {
    
    it('Decoder readInstructionRegValue Simple Test', () => {

        let instruction = [
            ['mov', 'r1', '#10'],
            ['mov', 'r2', 'r1'],
            ['add', 'r1', 'r1', 'r2'],
            ['str', 'r1', '[r2]']
        ];

        let decoder = new Decoder(instruction);

        decoder.next();

        let result = decoder.readInstructionRegValue();

        expect(result).toEqual([10]);

        decoder.next();

        result = decoder.readInstructionRegValue();

        expect(result).toEqual([0]);

        decoder.next();

        result = decoder.readInstructionRegValue();

        expect(result).toEqual([0, 0]);

        decoder.next();

        result = decoder.readInstructionRegValue();

        expect(result).toEqual([0, 0]);

    })
});