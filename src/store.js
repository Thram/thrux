/**
 * Created by thram on 16/01/17.
 */
const store = {};

export const getState = (key) => key ? store[key] : store;
export const setState = (key, value) => store[key] = value;