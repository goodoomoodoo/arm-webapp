class Register {
    constructor() {
        this.block = {
            r0: 0,
            r1: 0,
            r2: 0,
            r3: 0,
            r4: 0,
            r5: 0,
            r6: 0,
            r7: 0,
            r8: 0,
            r9: 0,
            r10: 0,
            fp: 0,
            ip: 0,
            sp: 0,
            lr: 0,
            pc: 0
        }
    }

    get r0() {
        return this.block.r0;
    }

    get r1() {
        return this.block.r1;
    }

    get r2() {
        return this.block.r2;
    }

    get r3() {
        return this.block.r3;
    }

    get r4() {
        return this.block.r4;
    }

    get r5() {
        return this.block.r5;
    }

    get r6() {
        return this.block.r6;
    }

    get r7() {
        return this.block.r7;
    }

    get r8() {
        return this.block.r8;
    }

    get r9() {
        return this.block.r9;
    }

    get r10() {
        return this.block.r10;
    }

    get fp() {
        return this.block.fp;
    }

    get ip() {
        return this.block.ip;
    }

    get sp() {
        return this.block.sp;
    }

    get lr() {
        return this.block.lr;
    }

    get pc() {
        return this.block.pc;
    }

    set r0(value) {
        this.block.r0 = value;
    }

    set r1(value) {
        this.block.r1 = value;
    }

    set r2(value) {
        this.block.r2 = value;
    }

    set r3(value) {
        this.block.r3 = value;
    }

    set r4(value) {
        this.block.r4 = value;
    }

    set r5(value) {
        this.block.r5 = value;
    }

    set r6(value) {
        this.block.r6 = value;
    }

    set r7(value) {
        this.block.r7 = value;
    }

    set r8(value) {
        this.block.r8 = value;
    }

    set r9(value) {
        this.block.r9 = value;
    }

    set r10(value) {
        this.block.r10 = value;
    }

    set fp(value) {
        this.block.fp = value;
    }

    set ip(value) {
        this.block.ip = value;
    }

    set sp(value) {
        this.block.sp = value;
    }

    set lr(value) {
        this.block.lr = value;
    }

    set pc(value) {
        this.block.pc = value;
    }

    read(args) {
        if (args.rSrc !== undefined)
            args.rSrc = this.block[args.rSrc];

        if (args.rSrc2 !== undefined)
            args.rSrc2 = this.block[args.rSrc2];

        return args;
    }
}

export default Register;