import Assembler, {LUT, checkIsImmediate, checkIsRegister} from './assembler';

describe('Assembler Sanity Test', () => {
    let amb: Assembler = new Assembler([]);

    it('Filter Label with No Instruction', () => {
        let cmd: string[] = ['start:'];
        let labelTable: LUT = amb.filterLabel(cmd);

        /* Label table shouldn't care and default to 0 */
        expect(labelTable['start']).toBe(0);
    });

    it('Filter Label with Instruction', () => {
        let cmd1: string[] = ['start: mov r1, r2'];
        let cmd2: string[] = ['start:', 'mov r1, r2'];
        let lt1: LUT = amb.filterLabel(cmd1);
        let lt2: LUT = amb.filterLabel(cmd2);

        /* Labels should point to pc 0 */
        expect(lt1['start']).toBe(0);
        expect(lt2['start']).toBe(0);
    });

    it('Trim Instruction', () => {
        let cmd1: string[] = ['     mov   r1   ,r2    \n\t'];
        let cmd2: string[] = ['\t\tmov r1, r2   \n  '];
        amb.trimInstruction(cmd1);
        amb.trimInstruction(cmd2);

        expect(cmd1).toStrictEqual(['mov   r1   ,r2']);
        expect(cmd2).toStrictEqual(['mov r1, r2']);
    });

    it('Check Immediate Value', () => {
        let arg: string = '#18';

        expect(checkIsImmediate(arg)).toBe(true);
    });

    it('Check Register Name', () => {
        let arg1: string = 'r1';
        let arg2: string = 'abc';

        expect(checkIsRegister(arg1)).toBe(true);
        expect(checkIsRegister(arg2)).toBe(false);
    });

    it('Get Instruction Name', () => {
        let cmd1: string = 'add r1, r2, #3';
        let cmd2: string = 'mov  \t r1, \t r2';
        let cmd3: string = 'mov\tr1,\tr2';

        expect(amb.getInstrName(cmd1)).toBe('add');
        expect(amb.getInstrName(cmd2)).toBe('mov');
        expect(amb.getInstrName(cmd3)).toBe('mov');
    });

    it('Get Instruction Arguement Vector', () => {
        let cmd1: string = 'add';
        let cmd2: string = 'lrl r1, r2, #5';
        let cmd3: string = 'b\thello';
        let cmd4: string = 'sub\nr1,';
        let cmd5: string = 'a     a,a,a,a';

        expect(amb.getInstrArgv(cmd1)).toStrictEqual(['']);
        expect(amb.getInstrArgv(cmd2)).toStrictEqual(['r1', 'r2', '#5']);
        expect(amb.getInstrArgv(cmd3)).toStrictEqual(['hello']);
        expect(amb.getInstrArgv(cmd4)).toStrictEqual(['r1', '']);
        expect(amb.getInstrArgv(cmd5)).toStrictEqual(['a', 'a', 'a', 'a']);
    });

    it('Validate Instruction Name', async () => {
        let cmd1: string = 'add r1, r2, r3';
        let cmd2: string = 'hello r1, r2';

        await amb.validateInstructionName(cmd1)
            .then(instrName => expect(instrName).toBe('add'));
        await amb.validateInstructionName(cmd2)
            .catch(error => expect(error).toBeDefined());
    });

    it('Validate Instruction Type One', async () => {
        let cmd1: string = 'add r1, r2, r3';
        let cmd2: string = 'sub r1, r2, r3';
        let cmd3: string = 'eor hi, r2, r3';
        let cmd4: string = 'add r1, hi, r3';
        let cmd5: string = 'add r1, r2, hi';
        let cmd6: string = 'asr r1, r2, #100';

        await amb.validateTypeOneInstruction(cmd1)
            .then(argv => {
                expect(argv).toStrictEqual([['add', 'r1', 'r2', 'r3']]);
            });

        await amb.validateTypeOneInstruction(cmd2)
            .then(argv => {
                expect(argv).toStrictEqual([['sub', 'r1', 'r2', 'r3']]);
            });
        
        await amb.validateTypeOneInstruction(cmd3)
            .catch(error => expect(error).toBeDefined());

        await amb.validateTypeOneInstruction(cmd4)
            .catch(error => expect(error).toBeDefined());

        await amb.validateTypeOneInstruction(cmd5)
            .catch(error => expect(error).toBeDefined());

        await amb.validateTypeOneInstruction(cmd6)
            .then(argv => {
                expect(argv).toStrictEqual([['asr', 'r1', 'r2', '100']]);
            });
    });

    it('Validate Instruction Type Two', async () => {
        let cmd1: string = 'ldr r1, [r2]';
        let cmd2: string = 'ldrb r1, [r2, #10]';
        let cmd3: string = 'str r1, [r2], #100';
        let cmd4: string = 'ldrb r1, [r2, #10]!';
        let cmd5: string = 'ldrb r1, [r2, r3]';

        await amb.validateTypeTwoInstruction(cmd1)
            .then(argv => expect(argv).toStrictEqual([['ldr', 'r1', 'r2']]));

        await amb.validateTypeTwoInstruction(cmd2)
            .then(argv => {
                expect(argv).toStrictEqual([['ldrb', 'r1', 'r2', '10']])
            });

        await amb.validateTypeTwoInstruction(cmd3)
            .then(argv => {
                expect(argv).toStrictEqual([
                    ['str', 'r1', 'r2'],
                    ['add', 'r2', 'r2', '100']
                ])
            });

        await amb.validateTypeTwoInstruction(cmd4)
            .then(argv => {
                expect(argv).toStrictEqual([
                    ['add', 'r2', 'r2', '10'],
                    ['ldrb', 'r1', 'r2']
                ])
            });

        await amb.validateTypeTwoInstruction(cmd5)
            .catch(error => expect(error).toBeDefined());
    });

    it('Validate Instruction Type Three', async () => {
        let cmd1: string = 'push {r1}';
        let cmd2: string = 'pop {r1, r2}';
        let cmd3: string = 'push {r1r}';
        let cmd4: string = 'pop {r1-r5}';

        await amb.validateTypeThreeInstruction(cmd1)
            .then(argv => {
                expect(argv).toStrictEqual([
                    ['str', 'r1', 'sp'],
                    ['add', 'sp', 'sp', '4']
                ]);
            });

        await amb.validateTypeThreeInstruction(cmd2)
            .then(argv => {
                expect(argv).toStrictEqual([
                    ['ldr', 'r1', 'sp'],
                    ['sub', 'sp', 'sp', '4'],
                    ['ldr', 'r2', 'sp'],
                    ['sub', 'sp', 'sp', '4']
                ]);
            });

        await amb.validateTypeThreeInstruction(cmd3)
            .catch(error => expect(error).toBeDefined());

        await amb.validateTypeThreeInstruction(cmd4)
            .catch(error => expect(error).toBeDefined());
    });

    it('Validate Instruction Type Four', async () => {
        let cmd1: string = 'mov r1, #1';
        let cmd2: string = 'mvn r1, r2';
        let cmd3: string = 'cmp r2, sp';
        let cmd4: string = 'mov r1, r2, r3';
        let cmd5: string = 'mvn r1, #hi';

        await amb.validateTypeFourInstruction(cmd1)
            .then(argv => expect(argv).toStrictEqual([['mov', 'r1', '1']]));

        await amb.validateTypeFourInstruction(cmd2)
            .then(argv => expect(argv).toStrictEqual([['mvn', 'r1', 'r2']]));

        await amb.validateTypeFourInstruction(cmd3)
            .then(argv => expect(argv).toStrictEqual([['cmp', 'r2', 'sp']]));

        await amb.validateTypeFourInstruction(cmd4)
            .catch(error => expect(error).toBeDefined());

        await amb.validateTypeFourInstruction(cmd5)
            .catch(error => expect(error).toBeDefined());
    });
});