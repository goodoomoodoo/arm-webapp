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

 import { REGISTER_NAME, INSTR_TYPE } from './constants';

/**
 * Check if string represent immediate value
 * @param {String} str 
 */
const isImmd = str => {
    return str.charAt( 0 ) == '#' && isNumber( str.substring( 1, str.length ) );
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

/**
 * Return true if the String consists only digits
 * @param {String} num 
 */
const isNumber = num => {
    return num.match( /^[0-9]+$/ );
};

/**
 * Check if the string is a label
 * @param {String} str 
 */
const isLabel = str => {
    return str.charAt( str.length - 1 ) == ':';
}

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
    return str.match( /^[a-zA-Z0-9]+:$/ );
};

/**
 * 
 * @param {String} iname 
 * @param {Object} argo 
 */
const checkSyntax = ( opType, iname, argo, line ) => {

    if( opType == -1 )
        throw new Error( `Illegal Instruction: ${iname} at ${line}.`);

    if( opType == 0 ) {
        
        if( labelObj[ argo.label ] == undefined )
            throw new Error( `Syntax Error: label ${argo.label} not found.` );

    }

    if( opType == 1 ) {

        if( argo.rd == undefined )
            throw new Error( `Syntax Error: [rd] register not found at 
                ${line}.` );

        if( argo.rSrc == undefined )
            throw new Error( `Syntax Error: [rSrc] register not found at 
                ${line}` );

        if( iname == 'mov' || iname == 'mvn' || iname == 'cmp' ) {

            if( !isRegister( argo.rd ) )
                throw new Error( `Syntax Error: [rd] register expected, but 
                    received ${argo.rd} at ${line}.` );

            if( !isRegister( argo.rSrc ) && !isImmd( argo.rSrc ) )
                throw new Error( `Syntax Error: [rSrc] register or immediate value
                expected, but received ${argo.rSrc} at ${line}.`)

        } else if( !isRegister( argo.rSrc ) )
            throw new Error( `Syntax Error: [rSrc] register expected, but
                received ${argo.rSrc} at ${line}.`);

        else if( argo.rSrc2 == undefined )
            throw new Error( `Syntax Error: third argument required at ${line}.` );

        else if( !isRegister( argo.rSrc2 ) && !isImmd( argo.rSrc2 ) )
            throw new Error( `Syntax Error: [rSrc2] register or immediate value
                expected, but received ${argo.rSrc2} at ${line}.` );
    }

    if( opType == 2 ) {

        if( argo.rBase == undefined) 
            throw new Error( `Syntax Error: [rSrc] register not found at 
                ${line}.` );

        if( !isRegister( argo.rBase ) ) 
            throw new Error( `Syntax Error: [rSrc] register expected, but 
                received ${argo.rBase} at ${line}.` );

        if( argo.offset != undefined )
            if( !isRegister( argo.offset ) && !isImmd( argo.offset ) )
                throw new Error( `Syntax Error: [offset] register or immediate
                    value expected, but received ${argo.offset} at ${line}.` );
    }
}

/**
 * Returns the first word of an instruction
 * @param {String} instr 
 */
const getFirstWord = instr => {

    if( instr.length == 0 )
        return null;

    let i = 0;
    let str = "";

    while( i < instr.length && instr.charAt( i ) != ' ' ) {
        str = str.concat( instr.charAt( i ) );
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

    return ({
        name: str.toLowerCase(),
        index: i
    });
}

/**
 * Return a list of argument registers
 * @param {string} input whole line of instruction
 * @param {int} index start of the instruction
 * @return {string array} array of arguments
 */
const getArguments = ( opType, input, index ) => {

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

    if( opType == 0 ) {

        if( arr.length > 1 )
            throw new Error( 'Syntax error: only 1 argument expected.' );
        
        return {
            label: arr[ 0 ]
        };
    }

    if( opType == 1 ) {

        let rd = arr[ 0 ] == undefined ? undefined : arr[ 0 ].toLowerCase();
        let rSrc = arr[ 1 ] == undefined ? undefined : arr[ 1 ].toLowerCase();
        let rSrc2 = arr[ 2 ] == undefined ? undefined : arr[ 2 ].toLowerCase();

        return {
            rd: rd,
            rSrc: rSrc,
            rSrc2: rSrc2
        };
    }

    if( opType == 2 ) {

        let rd = arr[ 0 ] == undefined ? undefined : arr[ 0 ].toLowerCase();
        let rBase = arr[ 1 ] == undefined ? undefined : arr[ 1 ].toLowerCase();
        let offset = arr[ 2 ] == undefined ? undefined : arr[ 2 ].toLowerCase();

        if( arr[ 3 ] != undefined )
            throw new Error( 'Syntax error: 2 arguments expected, but received 3.' );

        if( rBase != undefined ) {

            if( rBase.charAt( 0 ) == '[' ) {

                rBase = rBase.substring( 1, rBase.length );

                if( rBase.charAt( rBase.length - 1 ) == ']' )
                    return {
                        rd: rd,
                        rBase: rBase.substring( 0, rBase.length - 1 )
                    };
                else if( offset != undefined && 
                    offset.charAt( offset.length - 1 ) == ']' )
                    return {
                        rd: rd,
                        rBase: rBase,
                        offset: offset.substring( 0, offset.length - 1 )
                    };

                throw new Error( 'Syntax error: \']\' is expected.');
            }
        } else {
            return {
                rd: rd
            };
        }
        
    }

    return {};
}

/**
 * Return instruction type
 * 0: Branching 1: Data-Processing 2:Memory-Accessing
 * @param {String} iname instruction name
 */
const getOpType = iname => {

    let dataProcessing = INSTR_TYPE[ 1 ];

    for( let i = 0; i < dataProcessing.length; i++ ) {
        if( dataProcessing[ i ] == iname )
            return 1;
    }

    let memoryAccessing = INSTR_TYPE[ 2 ];

    for( let i = 0; i < memoryAccessing.length; i++ ) {
        if( memoryAccessing[ i ] == iname )
            return 2;
    }

    let branch = INSTR_TYPE[ 0 ];

    for( let i = 0; i < branch.length; i++ ) {
        if( branch[ i ] == iname )
            return 0;
    }

    return -1; // Instruction unfound
}

/**
 * 
 * @param {int} opType 
 * @param {String} iname 
 * @param {Object} argo 
 */
const execBranch = ( opType, iname, argo ) => {
    let pc = labelObj[ argo.label ];
    let cond = false;

    switch( iname ) {
        case 'b':
            cond = true;
            break;
        case 'beq':
            cond = cmpState == 0;
            break;
        case 'bne':
            cond = cmpState != 0;
            break;
        case 'ble':
            cond = cmpState <= 0;
            break;
        case 'blt':
            cond = cmpState < 0;
            break;
        case 'bge':
            cond = cmpState >= 0;
            break;
        case 'bgt':
            cond = cmpState > 0;
            break;
        default:
            console.log( 'ERROR' );
    }

    return { opType: opType, pc: pc, cond: cond };
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
        case 'cmp':
            if( isImmd( rSrc ) )
                cmpState = register[ rd ] - parseInt( rSrc.substring( 1, rSrc.length ), 10 );
            else
                cmpState = register[ rd ] - register[ rSrc ];
            
            res = cmpState;
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

            if( stackObj[ addr ] != undefined ) {
                res = stackObj[ addr ];
            } else {
                res = 0;
            }

            break;
        case 'ldrb':
            if( offset != undefined ) {
                if( offsetVal != undefined )
                    addr = register[ rBase ] + offsetVal;
                else
                    addr = register[ rBase ] + register[ offset ];
            } else {
                addr = register[ rBase ];
            }

            if( stackObj[ addr ] != undefined ) {
                res = stackObj[ addr ];
                res = res & 0xFF;
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
            stackObj[ addr ] = res;

            break;
        case 'strb':
            if( offset != undefined ) {
                if( offsetVal != undefined )
                    addr = register[ rBase ] + offsetVal;
                else
                    addr = register[ rBase ] + register[ offset ];
            } else {
                addr = register[ rBase ];
            }

            res = register[ rd ];
            res = res & 0xFF;
            stackObj[ addr ] = res;

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
    else if( opType == 0 )
        return execBranch( opType, iname, argo );
}

/**
 * 
 * @param {Array} instrArr 
 */
const transpileInstrArr = instrArr => {

    let exitCode = 0;

    let msgArr = [];

    if( instrArr == undefined )
        exitCode = 2;

    for( let i = 0; i < instrArr.length; i ++ ) {
        let currInstr = instrArr[ i ];
        if( hasLabel( currInstr ) ) {
            let label = getFirstWord( currInstr );
            let labelName = label.name.substring( 0, label.name.length - 1 );

            labelObj[ labelName ] = i;
            instrArr[ i ] = currInstr.substring( label.index + 1, currInstr.length );  
        }
    }

    for( let i = 0; i < instrArr.length; i++ ) {

        let currInstr = instrArr[ i ];

        // If the current Instruction is only consists of spaces and tabs,
        // continue to the next Instruction.
        currInstr = currInstr.trim();
        if( currInstr.length == 0 )
            continue;

        let iname = getInstructionName( currInstr );
        let opType = getOpType( iname.name );
        let argo = getArguments( opType, currInstr, iname.index );

        try {
            checkSyntax( opType, iname.name, argo, i );
        } catch( error ) {
            msgArr.push( error.message );
            exitCode = 1;
        }
    }

    if( msgArr.length == 0 )
        return { 
            exitCode: exitCode, 
            msgArr: [ "Transpile completed. Success." ] 
        };
    
    return { 
        exitCode: exitCode, 
        msgArr: msgArr 
    };
}

/**
 * Transpile the String instructions into Array of Objects
 * @param {Array} instrArr list of instruction lines
 */
const debugInstrArr = instrArr => {

    let objArr = [];

    for( let i = 0; i < instrArr.length; i ++ ) {
        let currInstr = instrArr[ i ];
        if( hasLabel( currInstr ) ) {
            let label = getFirstWord( currInstr );
            let labelName = label.name.substring( 0, label.name.length - 1 );

            labelObj[ labelName ] = i;
            instrArr[ i ] = currInstr.substring( label.index + 1, currInstr.length );  
        }
    }

    for( let i = 0; i < instrArr.length; i++ ) {

        let currInstr = instrArr[ i ];

        // If the current Instruction is only consists of spaces and tabs,
        // continue to the next Instruction.
        currInstr = currInstr.trim();
        if( currInstr.length == 0 )
            continue;

        let iname = getInstructionName( currInstr );
        let opType = getOpType( iname.name );
        let argo = getArguments( opType, currInstr, iname.index );

        let resObj = exec( iname.name, argo );

        /* Perform Jump */
        if( opType == 0 ) {
            if( resObj.cond )
                i = resObj.pc - 1;
        }

        objArr.push( resObj );      
    }

    return objArr;
}

var labelObj = {};

var stackObj = {};

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
};

var cmpState = 0;

const Instruction = {
    transpileInstrArr: transpileInstrArr,
    debugInstrArr: debugInstrArr
};

export default Instruction;