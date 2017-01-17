/**
 * Created by thram on 16/01/17.
 */
import isEqual from 'lodash/isEqual';
import {getState, setState, resetState} from "./store";

let dicts = {}, middlewares = [];

export const register = (newDicts) => Object.assign(dicts, newDicts);

export const addMiddleware = (middleware) => middlewares.push(middleware);

export const dispatch = (keyType, data) => {
  const [key, type]  = keyType.split(':'),
        dict         = dicts[key],
        action       = dict && dict[type];
  if (action) {
    const prevValue = getState(key),
          value     = action.map(data),
          nextValue = action.reducer(value);
    if (!isEqual(prevValue, nextValue)) {
      middlewares.forEach((middleware) => middleware({
        state  : key,
        action : type,
        prev   : prevValue,
        payload: value,
        next   : nextValue
      }));
      setState(key, nextValue);
    }
  }
};

export const state = getState;

export const clearState = resetState;

export const createDict = (map, reducer) => ({map, reducer});