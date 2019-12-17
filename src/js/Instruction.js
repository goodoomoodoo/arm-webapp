/**
 * INSTRUCTION CONTAINER
 * -----------------------------------------------------------------------------
 * Used inside DevContainer
 * Exports Object Value containing functions
 * 
 * const isImmd (function);
 * 
 * const isLabel (function);
 * 
 * TODO: create documentation
 */

/**
 * Check if string represent immediate value
 * @param {String} str 
 */
const isImmd = str => {
    return str.charAt( 0 ) == '#';
}

/**
 * Return true if the register name exist
 * @param {String} rName 
 */
const isRegister = rName => {
    for( let i = 0; i < REGISTER_NAME.length; i++ )
        if( rName == REGISTER_NAME[ i ] )
            return true;
    return false
};

// TODO
const isNumber = undefined;

/**
 * Check if instruction has label
 * @param {String} instr 
 */
const hasLabel = instr => {
    let fword = getFirstWord( instr );

    if( fword == null )
        return false;
    
    return isLabel( fword.name ) && isValidLabel( fword.name );
}

/**
 * Check if label is valid, only alphabets and numbers
 * @param {String} str label
 */
const isValidLabel = str => {
    return str.match( /^[a-zA-Z0-9]+$/ );
};

/**
 * 
 * @param {String} iname 
 * @param {Object} argo 
 */
const isValidSyntax = ( iname, argo ) => {
    let opType = getOpType( iname );

    if( argo.error != undefined )
        return false;

    if( opType == -1 )
        return false;

    if( opType == 1 ) {

        if( iname == 'mov' || iname == 'mvn' )
            return argo.rSrc != undefined;
        
        return argo.rSrc != undefined && argo.rSrc2 != undefined;
    }

    if( opType == 2 ) {
        return argo.rBase != undefined;
    }
}

/**
 * Check if the string is a label
 * @param {String} str 
 */
const isLabel = str => {
    return str.charAt( str.length - 1 ) == ':';
}

// TODO: store label name and label position
const markLabel = undefined;

/**
 * Returns the first word of an instruction
 * @param {String} instr 
 */
const getFirstWord = instr => {

    if( instr.length == 0 )
        return null;

    let i = 0;
    let str = "";

    while( instr.charAt( i ) != ' ' && i < instr.length ) {
        str.concat( instr.charAt( i ) );
        i++;
    }

    return { name: str, index: i };
}
 
/**
 * Returns the instruction of a line
 * @param {string} input whole line of instruction
 * @return {object} { the instruction of this input, index at end of instr }
 */
const getInstructionName = ( input ) => {

    let i = 0;
    let str = "";

    if( input.length == 0 )
        return str;

    while( input.charAt( i ) != ' ' && i < input.length ) {
        str = str.concat( input.charAt( i ) );
        i++;
    }

    // If the first string is label, then get the second string
    if( isLabel( str ) ) {
        i++;
        str = "";
        while( input.charAt( i ) != ' ' && i < input.length ) {
            str = str.concat( input.charAt( i ) );
            i++;
        }
    }

    str.toLowerCase();

    return ({
        name: str,
        index: i
    });
}

/**
 * Return a list of argument registers
 * @param {string} input whole line of instruction
 * @param {int} index start of the instruction
 * @return {string array} array of arguments
 */
const getArguments = ( input, index ) => {

    let i = index;
    let arr = [];
    let str = "";


    while( i < input.length ) {

        let currChar = input.charAt( i );

        if( currChar === ',' )
        {
            // Separate argument and reset str
            arr.push( str );
            str = "";

            // This is added to avoid double counting an argument
            i++;
            continue;
        }
        else if( currChar != ' ' )
        {
            str = str.concat( currChar );
        }

        if( i == input.length - 1 )
            arr.push( str );

        i++;
    }

    // destination register
    let rd = arr[ 0 ];

    let rSrc = arr[ 1 ];
    let rSrc2 = arr[ 2 ];

    let rBase = undefined;
    let offset = undefined;

    if( rSrc.charAt( 0 ) == '[' )
        rBase = rSrc.substring( 1, rSrc.length );

    /**
     * NOTE: This condition ONLY assumes the syntax with two argument in
     *       memory block notation
     */
    if( rBase != undefined ) {
        if( rBase.charAt( rBase.length - 1 ) != ']' ) {
            if( rSrc2 == undefined )
                return { error: 'Syntax error: \']\' is expected.' };
            if( rSrc2.charAt( rSrc2.length - 1 ) != ']' )
                return { error: 'Syntax error: \']\' is expected.' };
            offset = rSrc2.substring( 0, rSrc2.length - 1 );
        }else
            rBase = rBase.substring( 0, rBase.length - 1 );
    }

    return {
        rd: rd,
        rSrc: rSrc,
        rSrc2: rSrc2,
        rBase: rBase,
        offset: offset
    };
}

/**
 * Return instruction type
 * 0: Branching 1: Data-Processing 2:Memory-Accessing
 * @param {String} iname instruction name
 */
const getOpType = iname => {

    let dataProcessing = instrType[ 1 ];

    for( let i = 0; i < dataProcessing.length; i++ ) {
        if( dataProcessing[ i ] == iname )
            return 1;
    }

    let memoryAccessing = instrType[ 2 ];

    for( let i = 0; i < memoryAccessing.length; i++ ) {
        if( memoryAccessing[ i ] == iname )
            return 2;
    }

    let branch = instrType[ 0 ];

    for( let i = 0; i < branch.length; i++ ) {
        if( branch[ i ] == iname )
            return 0;
    }

    return -1; // Instruction unfound
}

/**
 * Perform Data Processing Instructions
 * @param {int} opType operation type (e.g. Data Processing )
 * @param {String} iname instruction name
 * @param {Object} argo Object of register sources
 */
const execDataProc = ( opType, iname, argo ) => {
    let rd = argo.rd;
    let rSrc = argo.rSrc;
    let rSrc2 = argo.rSrc2;
    let rVal = undefined;
    let res = undefined;

    if( rSrc2 && isImmd( rSrc2 ) )
        rVal = parseInt( rSrc2.substring( 1, rSrc2.length ) );

    switch( iname ) {
        case 'mov':
            if( isImmd( rSrc ) )
                res = parseInt( rSrc.substring( 1, rSrc.length ), 10 );
            else 
                res = register[ rSrc ];
            break;
        case 'mvn':
            if( isImmd( rSrc ) )
                res = ~parseInt( rSrc.substring( 1, rSrc.length ), 10 );
            else
                res = ~register[ rSrc ];
            break;
        case 'add':
            if( isImmd( rSrc2 ) )
                res = register[ rSrc ] + rVal;
            else
                res = register[ rSrc ] + register[ rSrc2 ];
            break;
        case 'sub':
            if( isImmd( rSrc2 ) )
                res = register[ rSrc ] - rVal;
            else
                res = register[ rSrc ] - register[ rSrc2 ];
            break;
        case 'and':
            if( isImmd( rSrc2 ) )
                res = register[ rSrc ] & rVal;
            else
                res = register[ rSrc ] & register[ rSrc2 ];
            break;
        case 'orr':
            if( isImmd( rSrc2 ) )
                res = register[ rSrc ] | rVal;
            else
                res = register[ rSrc ] | register[ rSrc2 ];
            break;
        case 'lsl':
            if( isImmd( rSrc2 ) )
                res = register[ rSrc ] << rVal;
            else 
                res = register[ rSrc ] << register[rSrc2 ];
            break;
        case 'lsr':
            if( isImmd( rSrc2 ) )
                res = register[ rSrc ] >>> rVal;
            else
                res = register[ rSrc ] >>> register[ rSrc2 ];
            break;
        case 'asr':
            if( isImmd( rSrc2 ) )
                res = register[ rSrc ] >> rVal;
            else
                res = register[ rSrc ] >> register[ rSrc2 ];
            break;
        case 'eor':
            if( isImmd( rSrc2 ) )
                res = register[ rSrc ] ^ rVal;
            else
                res = register[ rSrc ] ^ register[ rSrc2 ];
            break;
        default:
            /**
             * This log most likely wouldn't be reached since getOpType checked
             * the validity of the instruction
             */
            console.log( 'ERROR: Data processing instruction not found.' );
    }

    // Perform
    register[ rd ] = res;

    return { opType: opType, register: rd, value: res };
}

/**
 * 
 * @param {int} opType 
 * @param {String} iname 
 * @param {Object} argo 
 */
const execMemAcc = ( opType, iname, argo ) => {
    let rd = argo.rd;
    let addr = undefined;
    let rBase = argo.rBase;
    let offset = argo.offset; // index out of bound returns undefine
    let offsetVal = undefined;
    let res = undefined;

    // TODO: check if offset and rBase are valid register

    // TODO: check if the string is convertable to int
    if( offset != undefined && isImmd( offset ) )
        offsetVal = parseInt( offset.substring( 1, offset.length ) );

    switch( iname ){
        case 'ldr':
            if( offset != undefined ) {
                if( offsetVal != undefined )
                    addr = register[ rBase ] + offsetVal;
                else
                    addr = register[ rBase ] + register[ offset ];
            } else {
                addr = register[ rBase ];
            }

            if( STACK[ addr ] != undefined ) {
                res = STACK[ addr ];
            } else {
                res = 0;
            }

            break;
        case 'str':
            if( offset != undefined ) {
                if( offsetVal != undefined )
                    addr = register[ rBase ] + offsetVal;
                else
                    addr = register[ rBase ] + register[ offset ];
            } else {
                addr = register[ rBase ];
            }

            res = register[ rd ];
            STACK[ addr ] = res;

            break;
        default:
            /**
             * This log most likely wouldn't be reached since getOpType checked
             * the validity of the instruction
             */
            console.log( 'ERROR: Memory accessing instruction not found.')
    }

    return { opType: opType, register: rd, address: addr, value: res };
}

/**
 * Execute the instruction with given list of arguments
 * @param {String} iname instruction name
 * @param {Object} argo Object of register sources
 */
const exec = ( iname, argo ) => {

    // opType is -1 if instruction isn't found
    let opType = getOpType( iname );

    if( opType == 1 )
        return execDataProc( opType, iname, argo );
    else if( opType == 2 )
        return execMemAcc( opType, iname, argo );
}

/**
 * Transpile the String instructions into Array of Objects
 * @param {Array} instrArr list of instruction lines
 */
const transpileInstrArr = instrArr => {

    let objArr = [];

    if( instrArr == undefined )
        return 2; // exit code: code unfound
    
    if( instrArr.length == 0 )
        return 127; // exit code: code not executable

    for( let i = 0; i < instrArr.length; i++ ) {

        let currInstr = instrArr[ i ];
        if( hasLabel( currInstr ) ) {
            let label = getFirstWord( currInstr );
            let labelName = label.name.substring( 0, label.name.length - 1 );
            labelObj[ labelName ] = i;
            currInstr = currInstr.substring( label.index, currInstr.length );
        }

        // If the current Instruction is only consists of spaces and tabs,
        // continue to the next Instruction.
        if( currInstr.trim().length == 0 )
            continue;

        let iname = getInstructionName( currInstr );
        let argo = getArguments( currInstr, iname.index );
    
        if( isValidSyntax( iname.name, argo ) ) {
            let resObj = exec( iname.name, argo );

            if( resObj.error != undefined )
                return resObj;
            else
                objArr.push( resObj );

        } else if( argo.error != undefined )
            return argo;
          
    }

    return objArr;
}

// TODO: refractor all labelObj to LABEL
var labelObj = {};

var STACK = {};

// TODO: refractor all register to REGISTER
var register = {
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
    lr: 0,
    fp: 0,
    ip: 0,
    sp: 0,
    pc: 0
}

const REGISTER_NAME = [ 'r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7',
    'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15', 'lr', 'fp', 'ip',
    'sp', 'pc' ];

// TODO: refractor all instrType to INSTR_TYPE
const instrType = {
    0: [ 'b', 'beq', 'bl', 'blt', 'ble', 'bgt', 'bge', 'bx'],
    1: [ 'add', 'and', 'asr', 'cmp', 'eor', 'lsl', 'lsr', 'mov', 'mvn', 'mul', 
        'orr', 'sub'],
    2: [ 'ldr', 'ldrb', 'str', 'strb' ]
};

const Instruction = {
    transpileInstrArr: transpileInstrArr
};

export default Instruction;