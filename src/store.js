/**
 * Created by thram on 16/01/17.
 */
import pick from 'lodash/pick';
import isArray from 'lodash/isArray';
let store = {};

export const getState = (key) => key ? (isArray(key) ? pick(store, key) : store[key]) : store;
export const setState = (key, value) => store[key] = value;