import store from '../redux/store/index';
import {setStack} from '../redux/actions';

class Memory {
    /** Note: each block is 4 byte and address is bounded by 32 bits */

    /** Simulates Direct Mapping */
    constructor() {
        this.block = {

        };
    }

    read(addr) {

        /** locate the block the address specifies */
        let index = addr % 4;
        let blockAddr = addr - index;
        let upperBlock = this.block[`${blockAddr}`];
        let valueBlock = [];

        /** Block has not been written previously */ 
        if (upperBlock === undefined) {

            for (let i = index; i < 4; i++) {
                valueBlock.push(0);
            }

        } else {

            for (let i = index; i < 4; i++) {
                valueBlock.push(upperBlock[i]);
            }
        }

        /** There are values in lower block */
        if (index !== 0) {
            
            let lowerBlock = this.block[`${blockAddr + 4}`];

            if (lowerBlock === undefined) {

                for (let i = 0; i < index; i++) {
                    valueBlock.push(0);
                }

            } else {

                for (let i = 0; i < index; i++) {
                    valueBlock.push(lowerBlock[i]);
                }
            }
            
        }

        /** Convert blocks to numeric value */
        return this.blockToNum(valueBlock);
    }

    write(addr, value) {

        let index = addr % 4;
        let upperBlock = this.block[`${addr - index}`];
        let valueBlock = this.numToBlock(value);

        if (upperBlock === undefined)
            this.block[`${addr - index}`] = [0, 0, 0, 0];

        if (index !== 0) {

            let lowerBlock = this.block[`${addr - index + 4}`];
            let count = 0;

            /** Check if the lower block exist */
            if (lowerBlock === undefined)
                this.block[`${addr - index + 4}`] = [0, 0, 0, 0];

            /** Fill upper block */
            for (let i = index; i < 4; i++) {
                this.block[`${addr - index}`][i] = valueBlock[count++];
            }

            /** Fill lower block */
            for (let i = 0; i < index; i++) {
                this.block[`${addr - index + 4}`][i] = valueBlock[count++];
            }

        } else {

            /** Fill upper block */
            for (let i = index; i < 4; i++) {
                this.block[`${addr - index}`][i] = valueBlock[i];
            }
        }

        store.dispatch(
            setStack(
                {
                    block: this.block
                }
            )
        );
    }

    /**
     * Converts the block to one numeric value
     * @param {Number[]} block 
     */
    blockToNum(block) {
        return block[0] * Math.pow(16, 3) + block[1] * Math.pow(16, 2) + 
            block[2] * Math.pow(16, 1) + block[3];
    }

    numToBlock(value) {
        let block = [0, 0, 0, 0];

        block[3] = value % 16;
        value = value >>> 4;
        block[2] = value % 16;
        value = value >>> 4;
        block[1] = value % 16;
        value = value >>> 4;
        block[0] = value % 16;
        value = value >>> 4;

        return block;
    }
}

export default Memory;