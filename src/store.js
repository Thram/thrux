/**
 * Created by thram on 16/01/17.
 */
import pick from 'lodash/pick';
import isArray from 'lodash/isArray';
import clone from 'lodash/cloneDeep';

let store = {};

export const clearStore = () => store = {};
export const getState = (key) => clone(key ? (isArray(key) ? pick(store, key) : store[key]) : store);
export const setState = (key, value) => store[key] = value;