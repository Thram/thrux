/**
 * Created by thram on 16/01/17.
 */
import {
  createDict,
  register,
  removeObserver as _removeObserver,
  observe as _observe,
  clearObservers,
  getActions,
  addMiddleware,
  dispatch as _dispatch,
  state,
  reset,
  init,
  clear,
  initState,
} from '../index';

const removeObserver = stateKey => funct => _removeObserver(stateKey, funct);

const observe = stateKey => funct => _observe(stateKey, funct);

const dispatch = keyType => data => _dispatch(keyType, data);

export {
  createDict,
  register,
  removeObserver,
  observe,
  clearObservers,
  getActions,
  addMiddleware,
  dispatch,
  state,
  reset,
  init,
  clear,
  initState,
};
export default {
  createDict,
  register,
  removeObserver,
  observe,
  clearObservers,
  getActions,
  addMiddleware,
  dispatch,
  state,
  reset,
  init,
  clear,
  initState,
};
