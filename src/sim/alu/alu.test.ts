import ALU, {Flag} from './alu';
import RegisterFile from '../register/register';

describe('ALU Sanity Test', () => {
    let alu: ALU = new ALU();

    it('Type Zero Validation', () => {
        let cmd1: string[] = ['b', 'name'];
        let cmd2: string[] = ['bl', 'name'];
        let cmd3: string[] = ['beq', 'name'];
        let cmd4: string[] = ['blt', 'name'];
        let cmd5: string[] = ['bge', 'name'];

        expect(alu.executeTypeZero(cmd1)).toBe(Flag.high);
        expect(alu.executeTypeZero(cmd2)).toBe(Flag.high);
        expect(alu.executeTypeZero(cmd3)).toBe(Flag.low);
        expect(alu.executeTypeZero(cmd4)).toBe(Flag.low);
        expect(alu.executeTypeZero(cmd5)).toBe(Flag.high);

        /* Alu change flags by compare */
        alu.flag.zero = Flag.high;

        expect(alu.executeTypeZero(cmd3)).toBe(Flag.high);
        expect(alu.executeTypeZero(cmd5)).toBe(Flag.high);

        alu.flag.zero = Flag.low;
        alu.flag.negative = Flag.high;

        expect(alu.executeTypeZero(cmd4)).toBe(Flag.high);
    });

    it('Type One Validation', () => {
        let regFile: RegisterFile = new RegisterFile();
        let cmd1: string[] = ['add', 'r1', 'r2', '3'];
        let cmd2: string[] = ['lsl', 'r1', 'r2', '3'];
        let cmd3: string[] = ['orr', 'r1', 'r2', '3'];

        expect(alu.executeTypeOne(cmd1, regFile)).toBe(3);
        expect(alu.executeTypeOne(cmd2, regFile)).toBe(0);
        expect(alu.executeTypeOne(cmd3, regFile)).toBe(3);

        regFile.block['r2'] = 1;

        expect(alu.executeTypeOne(cmd1, regFile)).toBe(4);
        expect(alu.executeTypeOne(cmd2, regFile)).toBe(8);
        expect(alu.executeTypeOne(cmd3, regFile)).toBe(3);
    });

    it('Type Four Validation', () => {
        let regFile: RegisterFile = new RegisterFile();
        let cmd1: string[] = ['cmp', 'r1', '3'];
        let cmd3: string[] = ['beq', 'name'];
        let cmd4: string[] = ['bgt', 'name'];
        let cmd5: string[] = ['ble', 'name'];

        alu.executeTypeFour(cmd1, regFile);

        expect(alu.executeTypeZero(cmd3)).toBe(Flag.low);
        expect(alu.executeTypeZero(cmd4)).toBe(Flag.low);
        expect(alu.executeTypeZero(cmd5)).toBe(Flag.high);
    });
});