import { 
  SET_REGISTER,
  SET_STACK,
  SET_CONSOLE_OUTPUT,
  SET_CONSOLE_INSTRUCTION } from '../constants';

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
  block: {},
  console: {
      error: {},
      instruction: {}
  }
}

const rootReducer = ( state = initialState, action ) => {
  if( action.type === SET_REGISTER ) {
    let newRegister = Object.assign( {}, action.payload );
    return Object.assign( {}, state, { register: newRegister } );
  }

  if( action.type === SET_STACK ) {
    return Object.assign( {}, state, action.payload );
  }

  if( action.type === SET_CONSOLE_OUTPUT ) {
    let newError = Object.assign( {}, state.console, 
      { error: action.payload } );
    return Object.assign( {}, state, { console: newError });
  }

  if( action.type === SET_CONSOLE_INSTRUCTION ) {
    let newInstruction = Object.assign( {}, state.console, 
      { instruction: action.payload } );
    return Object.assign( {}, state, { console: newInstruction } );
  }

  return state;
}

export default rootReducer;