/**
 * Created by thram on 16/01/17.
 */
import {
  createDict as cD,
  register as reg,
  removeObserver as rO,
  observe as o,
  clearObservers as cO,
  getActions as gA,
  addMiddleware as aM,
  dispatch as d,
  state as s,
  reset as r,
  init as i,
  clear as c,
  initState as iS,
} from '../index';


export const createDict = cD;

export const removeObserver = stateKey => funct => rO(stateKey, funct);

export const observe = stateKey => funct => o(stateKey, funct);

export const clearObservers = cO;

export const getActions = gA;

export const addMiddleware = aM;

export const dispatch = keyType => data => d(keyType, data);

export const state = s;

export const reset = r;

export const init = i;

export const clear = c;

export const initState = iS;

export const register = reg;
