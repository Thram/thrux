/**
 * Created by thram on 16/01/17.
 */
import _pick from 'lodash/pick';
import _isArray from 'lodash/isArray';
import _clone from 'lodash/cloneDeep';

let store = {};

export const clearStore = () => {
  store = {};
};

const pickState = key => (_isArray(key) ? _pick(store, key) : store[key]);

export const getState = key => (_clone(key ? pickState(key) : store));

export const setState = (key, value) => {
  store[key] = value;
};
