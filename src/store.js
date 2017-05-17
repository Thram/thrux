/**
 * Created by thram on 16/01/17.
 */
import _pick from 'lodash/pick';
import _isArray from 'lodash/isArray';
import _clone from 'lodash/cloneDeep';

let store = {};

const initStore = (initialValues = {}) => {
  store = initialValues;
};

const clearStore = () => initStore();

const pickState = key => (_isArray(key) ? _pick(store, key) : store[key]);

const getState = key => _clone(key ? pickState(key) : store);

const setState = (key, value) => {
  store[key] = value;
};

export { setState, getState, clearStore, initStore };
export default { setState, getState, clearStore, initStore };
