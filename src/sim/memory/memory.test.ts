import Memory from './memory';

describe('Memory Sanity Test', () => {
    it('Write Test', () => {
        let mem: Memory = new Memory();

        mem.write(0, 100);
        expect(mem.block[0]).toBe(100);

        mem.write(7, 0xFFFFFFFF);
        expect(mem.block[4]).toBe(0xFF);
        expect(mem.block[8]).toBe(0xFFFFFF00 << 0);
    });

    it('Write Byte Test', () => {
        let mem: Memory = new Memory();

        mem.writeByte(0, 0xFF);
        /* Left shift 0 is added to make the number signed */
        expect(mem.block[0]).toBe(0xFF000000 << 0);

        mem.writeByte(3, 0xFF);
        expect(mem.block[0]).toBe(0xFF0000FF << 0);
    });

    it('Read Test', () => {
        let mem: Memory = new Memory();

        mem.write(0, 0x3C65FF8E);
        expect(mem.read(0)).toBe(0x3C65FF8E);

        mem.write(7, 0x424265AC);
        expect(mem.read(7)).toBe(0x424265AC);
    });

    it('Read Byte Test', () => {
        let mem: Memory = new Memory();

        mem.write(0, 0x3C65FF8E);
        expect(mem.readByte(0)).toBe(0x3C);
        expect(mem.readByte(1)).toBe(0x65);
        expect(mem.readByte(2)).toBe(0xFF);
        expect(mem.readByte(3)).toBe(0x8E);

        mem.write(7, 0x424265AC);
        expect(mem.readByte(7)).toBe(0x42);
        expect(mem.readByte(8)).toBe(0x42);
        expect(mem.readByte(9)).toBe(0x65);
        expect(mem.readByte(10)).toBe(0xAC);
    })
});