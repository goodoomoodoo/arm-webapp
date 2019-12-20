export const REGISTER_NAME = [ 'r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7',
    'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15', 'lr', 'fp', 'ip',
    'sp', 'pc' ];


export const INSTR_TYPE = {
    0: [ 'b', 'beq', 'bne', 'bl', 'blt', 'ble', 'bgt', 'bge', 'bx'],
    1: [ 'add', 'and', 'asr', 'cmp', 'eor', 'lsl', 'lsr', 'mov', 'mvn', 'mul', 
        'orr', 'sub'],
    2: [ 'ldr', 'ldrb', 'str', 'strb' ]
}; 