import Decoder from './decoder';
import RegisterFile from '../register/register';

describe('Decoder Sanity Test', () => {
    it('Dummy Assembled Instruction Test', () => {
        let ambInstr: string[][][] = [
            [['mov', 'r1', '1']],
            [['sub', 'r1', 'r2', '3']],
            [['ldr', 'r1', '[r2]']],
            [['cmp', 'r1', 'r2']],
            [['bgt', 'name']],
            [['lsl', 'r1', 'r2']]
        ];
        let regFile: RegisterFile = new RegisterFile()
        let decoder: Decoder = new Decoder(ambInstr, regFile);

        expect(decoder.hasNext()).toBe(true);
        expect(decoder.currInstr.length).toStrictEqual(1);
        expect(decoder.currInstrName).toStrictEqual('mov');
        expect(decoder.currInstrType).toBe(4);
        expect(decoder.control).toStrictEqual({
            writeBack: true,
            memRead: false,
            memWrite: false,
            jump: false,
            preIndex: false,
            postIndex: false
        });

        /* Process current instruction */
        decoder.nextSubInstr();
        decoder.next();

        expect(decoder.hasNext()).toBe(true);
        expect(decoder.currInstrName).toStrictEqual('sub');
        expect(decoder.currInstrType).toBe(1);
        expect(decoder.control).toStrictEqual({
            writeBack: true,
            memRead: false,
            memWrite: false,
            jump: false,
            preIndex: false,
            postIndex: false
        });

        decoder.nextSubInstr();
        decoder.next();

        expect(decoder.hasNext()).toBe(true);
        expect(decoder.currInstrName).toStrictEqual('ldr');
        expect(decoder.currInstrType).toBe(2);
        expect(decoder.control).toStrictEqual({
            writeBack: true,
            memRead: true,
            memWrite: false,
            jump: false,
            preIndex: false,
            postIndex: false
        });

        decoder.nextSubInstr();
        decoder.next();

        expect(decoder.hasNext()).toBe(true);
        expect(decoder.currInstrName).toStrictEqual('cmp');
        expect(decoder.currInstrType).toBe(4);
        expect(decoder.control).toStrictEqual({
            writeBack: false,
            memRead: false,
            memWrite: false,
            jump: false,
            preIndex: false,
            postIndex: false
        });

        decoder.nextSubInstr();
        decoder.next();

        expect(decoder.hasNext()).toBe(true);
        expect(decoder.currInstrName).toStrictEqual('bgt');
        expect(decoder.currInstrType).toBe(0);
        expect(decoder.control).toStrictEqual({
            writeBack: false,
            memRead: false,
            memWrite: false,
            jump: true,
            preIndex: false,
            postIndex: false
        });

        decoder.nextSubInstr();
        decoder.next();

        expect(decoder.hasNext()).toBe(false);
        expect(decoder.currInstrName).toStrictEqual('lsl');
        expect(decoder.currInstrType).toBe(1);
        expect(decoder.control).toStrictEqual({
            writeBack: true,
            memRead: false,
            memWrite: false,
            jump: false,
            preIndex: false,
            postIndex: false
        });
    });
});