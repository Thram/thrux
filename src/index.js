/**
 * Created by thram on 16/01/17.
 */
import remove from 'lodash/remove';
import clone from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import keys from 'lodash/keys';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import assign from 'lodash/assign';
import isEqual from 'lodash/isEqual';
import isArray from 'lodash/isArray';
import {Promise} from 'es6-promise';

import {getState, setState, clearStore} from "./store";

let middlewares = [],
    dicts       = {},
    observers   = {};

export const createDict = (reducer, map = (value) => value, error = (err) => console.error(err)) => ({
  map,
  reducer,
  error
});

const baseDict = {
  INIT: createDict(() => undefined)
};

const addObserver = (stateKey, funct) => observers[stateKey] = reduce([funct],
    (result, value) => [].concat(result, [value]),
    observers[stateKey] || []);

export const removeObserver = (stateKey, funct) => remove(observers[stateKey], (value) => isEqual(value, funct));

const processObserver = (observer, currentState, actionKey) => new Promise((resolve, reject) => (observer(currentState, actionKey), resolve()));

const processObservers = (stateKey, currentState, actionKey) => {
  const stateObservers = observers[stateKey];
  if (stateObservers && stateObservers.length > 0)
    stateObservers.forEach((observer) => processObserver(observer, currentState, actionKey));
};

const processMiddlewares = (status) => middlewares.forEach((middleware) => middleware(status));

export const observe = (stateKey, funct) => addObserver(stateKey, funct);

export const clearObservers = (stateKey) => observers[stateKey] = undefined;

export const register = (newDicts) => {
  assign(dicts, reduce(newDicts, (result, dict, stateKey) =>
      set(result, stateKey, assign({}, baseDict, dict)), {}));
  keys(newDicts).forEach(initState);
};

export const addMiddleware = (middleware) => isArray(middleware) ?
    middlewares = [].concat(middlewares, middleware) :
    middlewares.push(middleware);

const processAction = ({state, action, prev, payload, next}) => {
  if (!isEqual(prev, next)) {
    processMiddlewares({state, action, prev, payload, next: clone(next)});
    setState(state, next);
    processObservers(state, clone(next), action);
  }
};

const dispatchAction  = (keyType, data) => {
  const [state, action]  = keyType.split(':'),
        dict             = get(dicts, `${state}.${action}`);
  if (dict) {
    try {
      const prev    = getState(state),
            payload = dict.map(data);

      const processNext = (nextValue) => nextValue && nextValue.then ?
          nextValue.then(processNext, dict.error)
          : processAction({state, action, prev, payload, next: nextValue});

      processNext(dict.reducer(payload, prev));
    } catch (e) {
      dict.error(e)
    }
  }
};
export const dispatch = (keyType, data) => isArray(keyType) ?
    keyType.forEach((k) => dispatchAction(k, data))
    : dispatchAction(keyType, data);

export const state = getState;

export const reset = () => {
  middlewares = [];
  dicts       = {};
  observers   = {};
  clearStore();
};

export const initState = (key) => key ?
    dispatch(isArray(key) ? map(key, (k) => `${k}:INIT`) : `${key}:INIT`)
    : keys(getState()).forEach((k) => dispatch(`${k}:INIT`));