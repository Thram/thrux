/**
 * Created by thram on 16/01/17.
 */

import {getState, setState, resetState} from "./store";

let dicts = {};

export const register = (key, dict) => dicts[key] = dict;

export const dispatch = (key, type, data) => {
  const dict   = dicts[key],
        action = dict && dict[type];
  action && setState(key, action.reducer(action.map(data)));
};

export const state      = getState;
export const clearState = resetState;