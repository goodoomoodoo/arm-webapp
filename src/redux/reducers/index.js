import { SET_REGISTER, PROC_STACK, SET_CONSOLE_OUTPUT } from '../constants';

const initialState = {
  register: {
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
    sp: 0x4000,
    lr: 0,
    pc: 0x8000
  },
  memory: { stack: {} },
  console: { output: {} }
}

const rootReducer = ( state = initialState, action ) => {
  if( action.type === SET_REGISTER ) {
    let newRegister = Object.assign( {}, state.register, 
      { [action.payload.id]: action.payload.value } );
    return Object.assign( {}, state, { register: newRegister } );
  }

  if( action.type === PROC_STACK ) {
    let newStack = Object.assign( {}, state.memory.stack, 
      { [action.payload.addr]: action.payload.value } );
    let newMemory = Object.assign( {}, state.memory, { stack: newStack } );
    console.log( newMemory );
    return Object.assign( {}, state, { memory: newMemory } );
  }

  if( action.type === SET_CONSOLE_OUTPUT ) {
    let newOutput = Object.assign( {}, state.console, 
      { output: action.payload });
    return Object.assign( {}, state, { console: newOutput });
  }

  return state;
}

export default rootReducer;