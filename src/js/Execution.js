// import isImmd register getOpType
// export function exec
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

            if( stackObj[ addr ] != undefined ) {
                res = stackObj[ addr ];
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
export const exec = ( iname, argo ) => {

    // opType is -1 if instruction isn't found
    let opType = getOpType( iname );

    if( opType == 1 )
        return execDataProc( opType, iname, argo );
    else if( opType == 2 )
        return execMemAcc( opType, iname, argo );
}

let register = {
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
