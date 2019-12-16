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

/******************************************************************************
 * USED FOR EXECUTION
 * 
 ******************************************************************************/

/**
 * Check if string represent immediate value
 * @param {String} str 
 */
const isImmd = str => {
    return str.charAt( 0 ) == '#';
}

/******************************************************************************
 * USED FOR TRANSPILE
 * 
 ******************************************************************************/

/**
 * Check if instruction has label
 * @param {String} instr 
 */
const hasLabel = instr => {
    let fword = getFirstWord( instr );

    if( fword == null )
        return false;
    
    return isLabel( fword );
}

// TODO
const isValidLabel = undefined;

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

    return str;
}
 
/**
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
 * 
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

        if( currChar === '{' || currChar === '[' ) {
            // TODO: if you have nested argument
        }
        else if( currChar === ',' )
        {
            // Separate argument and reset str
            arr.push( str );
            str = "";
        }
        else if( currChar != ' ' )
        {
            str = str.concat( currChar );
        }

        if( i == input.length - 1 )
            arr.push( str );

        i++;
    }

    return arr;
}

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

const exec = ( iname, argv ) => {
    let rd = argv[ 0 ];
    let rSrc = argv.length > 0 ? argv[ 1 ] : undefined;
    let rSrc2 = argv.length > 1 ? argv[ 2 ] : undefined;
    let rVal = undefined;
    let res = undefined;

    let opType = getOpType( iname );

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
            console.log( 'error' );
    }

    // Perform
    register[ rd ] = res;

    if( opType != -1 )
        return { opType: opType, register: rd, value: res };
    else
        return { error: 'Illegal insturction found', instr: iname };
}

/**
 * Transpile the String instructions into Array of Objects
 * @param {Array} instrArr list of instruction lines
 */
const transpileInstrArr = instrArr => {

    let objArr = [];

    if( !instrArr )
        return 2; // exit code: code unfound
    
    if( instrArr.length == 0 )
        return 127; // exit code: code not executable

    for( let i = 0; i < instrArr.length; i++ ) {

        let currInstr = instrArr[ i ];
        if( hasLabel( currInstr ) )
            ;// TODO
        else {
            let iname = getInstructionName( currInstr );
            let argv = getArguments( currInstr, iname.index );
            let resObj = exec( iname.name, argv );

            if( resObj.error != undefined )
                return resObj;
            else
                objArr.push( resObj );
        }
    }

    return objArr;
}

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

const instrType = {
    0: [ 'b', 'beq', 'bl', 'blt', 'ble', 'bgt', 'bge', 'bx'],
    1: [ 'add', 'and', 'asr', 'cmp', 'eor', 'lsl', 'lsr', 'mov', 'mvn', 'mul', 
        'orr', 'sub'],
    2: [ 'ldr', 'ldrb', 'str', 'strb' ]
};

const Instruction = {
    isImmd: isImmd,
    isLabel: isLabel,
    hasLabel: hasLabel,
    getFirstWord: getFirstWord,
    getArguments: getArguments,
    getInstructionName: getInstructionName,
    transpileInstrArr: transpileInstrArr
};

export default Instruction;