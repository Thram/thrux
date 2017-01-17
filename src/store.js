/**
 * Created by thram on 16/01/17.
 */
let store = {};

export const getState = (key) => key ? store[key] : store;
export const setState = (key, value) => store[key] = value;
export const resetState = (key) => key ? store[key] = undefined : store = {};