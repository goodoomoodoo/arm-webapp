import Register from '../src/js/Register';

describe('Register Simple Test', () => {
    let register = new Register();

    it('Register Read Type 0 Simple Test', () => {
        
        let result = register.read({
            name: 'b',
            label: 'loop'
        });

        expect(result).toMatchObject({
            name:'b',
            label:'loop'
        });
    });

    it('Register Read Type 1 Simple Test', () => {

        let result = register.read({
            name: 'add',
            rd: 'r1',
            rSrc: 'r2',
            rSrc2: 'r3'
        });

        expect(result).toMatchObject({
            name: 'add',
            rd: 0,
            rSrc: 0,
            rSrc2: 0
        });
    });
});

describe('Register Intermediate Test', () => {
    let register = new Register();

    it('Register Read Type 1 Intermediate Test', () => {
        register.r3 = 10;

        let result = register.read({
            name: 'add',
            rd: 'r1',
            rSrc: 'r2',
            rSrc2: 'r3'
        });

        expect(result).toMatchObject({
            name: 'add',
            rd: 0,
            rSrc: 0,
            rSrc2: 10
        });
    });
})