import { SET_REGISTER } from '../constants';

const initialState = {
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
  pc: 0,
}

const rootReducer = ( state = initialState, action ) => {
  if( action.type === SET_REGISTER )
    return Object.assign( {}, state, { [action.payload.id]: action.payload.value });

  return state;
}

export default rootReducer;