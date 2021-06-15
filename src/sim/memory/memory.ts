interface MemoryBlock {
    [prop: number]: number
}

/* Word size in byte */
const WORD_SIZE = 4;
const BYTE = 8;

export default class Memory {
    /**
     * Memory class simulates the unlimited 32-bit memory file.
     */
    block: MemoryBlock;

    constructor() {
        this.block = {};
    }

    /**
     * Write full word
     * @param addr 
     * @param value 
     */
    write(addr: number, value: number, callback: Function) {
        let index = addr % WORD_SIZE;

        /* Check if the addr spans different block */
        if (index != 0) {
            let priorAddr: number = addr - index;
            let latterAddr: number = addr - index + WORD_SIZE;

            /* Check if prior block exists, if not create one */
            if (this.block[priorAddr] === undefined) {
                this.block[priorAddr] = 0;
            }

            let mask = 0xFFFFFFFF;

            /* Overwrite the prior address block */
            mask = mask >>> (index * BYTE);
            this.block[priorAddr] &= mask;

            /* Assign value to prior address block */
            let pvalue: number = value >>> (index * BYTE);
            this.block[priorAddr] |= pvalue;

            /* Overwrite the latter address block */
            mask = 0xFFFFFFFF;
            mask = mask << ((WORD_SIZE - index) * BYTE);
            let lvalue: number = value << ((WORD_SIZE - index) * BYTE);
            this.block[latterAddr] &= mask;
            this.block[latterAddr] |= lvalue;
        } else {
            this.block[addr] = value;
        }

        callback(this.block);
    }

    /**
     * Write the byte value (0x000000FF) to the given address
     * @param addr 
     * @param value 
     */
    writeByte(addr: number, value: number, callback: Function) {
        let mask: number = 0x000000FF;
        let index: number = addr % WORD_SIZE;

        /* Make sure the value is one byte */
        value &= mask;

        /* Overwrite the address block */
        mask = 0xFF000000 >>> ((index) * BYTE);
        mask = ~mask;
        value = value << ((WORD_SIZE - index - 1) * BYTE);

        this.block[addr - index] &= mask;
        this.block[addr - index] |= value;

        callback(this.block);
    }

    read(addr: number): number {
        let index: number = addr % WORD_SIZE;
        let value: number = 0;
        let priorAddr: number = addr - index;
        let latterAddr: number = addr - index + WORD_SIZE;

        if (index != 0) {
            let mask = 0xFFFFFFFF;
            mask = mask >>> (index * BYTE);
            value = this.block[priorAddr] & mask;
            value = value << (index * BYTE);

            mask = 0xFFFFFFFF;
            mask = mask << ((WORD_SIZE - index) * BYTE);
            let temp: number = this.block[latterAddr] & mask;
            value |= temp >>> ((WORD_SIZE - index) * BYTE);
        } else {
            value = this.block[addr];
        }

        return value;
    }

    readByte(addr: number): number {
        let index: number = addr % WORD_SIZE;
        let mask: number = 0xFF000000 >>> (index * BYTE);
        let value: number = this.block[addr - index] & mask;

        return value >>> ((WORD_SIZE - index - 1) * BYTE);
    }
}