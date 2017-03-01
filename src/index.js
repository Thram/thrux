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
import forEach from 'lodash/forEach';
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

const addObserver = (stateKey, funct) => {
  const [mainState, ...rest] = stateKey.match(/.+?(?=\.|\[+]|$)/g);
  observers[mainState]       = observers[mainState] || {_global: []};
  const _add                 = (key) =>
      observers[mainState][key] = reduce(
          [funct],
          (result, value) => [].concat(result, [value]),
          observers[mainState][key] || []
      );

  rest.length > 0 ? _add(rest.join('')) : _add('_global');
};

export const removeObserver = (stateKey, funct) => {
  const [mainState, ...rest] = stateKey.match(/.+?(?=\.|\[+]|$)/g);

  const _remove = (key) =>
      remove(observers[mainState][key], (value) => isEqual(value, funct));

  rest.length > 0 ? _remove(rest.join('')) : _remove('_global');
};

const processObserver = (observer, currentState, actionKey) => new Promise((resolve, reject) => (observer(currentState, actionKey), resolve()));

const processObservers = (stateKey, currentState, actionKey, prev) => {
  const stateObservers = observers[stateKey],
        _process       = (observers, key) => {
          observers
          && observers.length > 0
          && (key === '_global' || !isEqual(get(prev, `${stateKey}${key}`), get(currentState, `${stateKey}${key}`)))
          && forEach(observers, (observer) =>
              processObserver(
                  observer,
                  key === '_global' ? currentState
                      : get(currentState, `${stateKey}${key}`),
                  actionKey));
        };
  forEach(stateObservers, _process);
};

const processMiddlewares = (status) => forEach(middlewares, (middleware) => middleware(status));

export const observe = (stateKey, funct) => addObserver(stateKey, funct);

export const clearObservers = (stateKey) => observers[stateKey] = undefined;

export const register = (newDicts) => {
  assign(dicts, reduce(newDicts, (result, dict, stateKey) =>
      set(result, stateKey, assign({}, baseDict, dict)), {}));
  forEach(keys(newDicts), initState);
};

export const addMiddleware = (middleware) => isArray(middleware) ?
    middlewares = [].concat(middlewares, middleware) :
    middlewares.push(middleware);

const processAction = ({state, action, prev, payload, next}) => {
  if (!isEqual(prev, next)) {
    processMiddlewares({state, action, prev, payload, next: clone(next)});
    setState(state, next);
    processObservers(state, clone(next), action, prev);
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

      processNext(dict.reducer(payload, clone(prev)));
    } catch (e) {
      dict.error(e)
    }
  }
};
export const dispatch = (keyType, data) => isArray(keyType) ?
    forEach(keyType, (k) => dispatchAction(k, data))
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
    : forEach(keys(getState()), (k) => dispatch(`${k}:INIT`));