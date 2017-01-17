/**
 * Created by thram on 16/01/17.
 */

import {getState, setState, resetState} from "./store";

let dicts = {}, middlewares = [];

export const register = (key, dict) => dicts[key] = dict;

export const addMiddleware = (middleware) => middlewares.push(middleware);

export const dispatch = (keyType, data) => {
  const [key, type]  = keyType.split(':'),
        dict         = dicts[key],
        action       = dict && dict[type];
  if (action) {
    const value     = action.map(data),
          nextValue = action.reducer(value);
    middlewares.forEach((middleware) => middleware({prev: getState(key), payload: value, next: nextValue}));
    setState(key, action.reducer(action.map(data)));
  }
};

export const state = getState;

export const clearState = resetState;

export const createDict = (map, reducer) => ({map, reducer});