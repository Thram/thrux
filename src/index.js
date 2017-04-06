/**
 * Created by thram on 16/01/17.
 */
import _remove from 'lodash/remove';
import _clone from 'lodash/cloneDeep';
import _get from 'lodash/get';
import _set from 'lodash/set';
import _keys from 'lodash/keys';
import _map from 'lodash/map';
import _reduce from 'lodash/reduce';
import _assign from 'lodash/assign';
import _isEqual from 'lodash/isEqual';
import _isArray from 'lodash/isArray';
import _forEach from 'lodash/forEach';
import { getState, setState, clearStore, initStore } from './store';

let initValues = { middlewares: [], dicts: {}, observers: {}, store: {} };
let middlewares = [];
let dicts = {};
let observers = {};

const cleanKey = key => /\.?(.*)$/.exec(key)[1];

const defaultMap = value => value;
const defaultError = err => console.error(err);

export const createDict = (dispatcher, map = defaultMap, error = defaultError) => ({
  dispatcher,
  map,
  error,
});

const baseDict = { INIT: createDict(() => undefined) };

const addObserver = (stateKey, funct) => {
  const [mainState, ...rest] = stateKey.match(/.+?(?=\.|\[+]|$)/g);
  observers[mainState] = observers[mainState] || { _global: [] };

  const key = rest.length > 0 ? rest.join('') : '_global';

  observers[mainState][key] = _reduce(
      [funct],
      (result, value) => [].concat(result, [value]),
      observers[mainState][key] || [],
  );
};

export const removeObserver = (stateKey, funct) => {
  const [mainState, ...rest] = stateKey.match(/.+?(?=\.|\[+]|$)/g);

  const key = rest.length > 0 ? rest.join('') : '_global';

  if (observers[mainState]) {
    _remove(observers[mainState][key], value => _isEqual(value, funct));
  }
};

const processObserver = (observer, currentState, actionKey) => new Promise((resolve) => {
  observer(currentState, actionKey);
  resolve();
});

const processObservers = ({ stateKey, currentState, actionKey, prev }) => {
  const stateObservers = observers[stateKey];
  const hasChanged = key => !_isEqual(_get(prev, `${key}`), _get(currentState, `${key}`));
  const mustProcess = key => key === '_global' || hasChanged(key);
  const process = (sObservers, key) => {
    const cleanedKey = cleanKey(key);
    if (sObservers && sObservers.length > 0 && mustProcess(cleanedKey)) {
      _forEach(sObservers, observer =>
          processObserver(
              observer,
              key === '_global' ? currentState
                  : _get(currentState, `${cleanedKey}`),
              actionKey));
    }
  };
  _forEach(stateObservers, process);
};

const processMiddlewares = status => _forEach(middlewares, middleware => middleware(status));

export const observe = (stateKey, funct) => addObserver(stateKey, funct);

export const clearObservers = (stateKey) => {
  observers[stateKey] = undefined;
};

export const getActions = (stateKeys) => {
  const getStateActions = state => _map(_keys(dicts[state]), action => `${state}:${action}`);
  return stateKeys ?
      getStateActions(stateKeys)
      : _reduce(dicts, (result, _dict, state) => result.concat(getStateActions(state)), []);
};

export const addMiddleware = (middleware) => {
  middlewares = [].concat(middlewares, middleware);
};

const processAction = ({ state, action, prev, payload, next }) => {
  if (!_isEqual(prev, next)) {
    processMiddlewares({ state, action, prev, payload, next: _clone(next) });
    setState(state, next);
    processObservers({ stateKey: state, currentState: _clone(next), actionKey: action, prev });
  }
};

const dispatchAction = (keyType, data) => {
  const [state, action] = keyType.split(':');
  const dict = _get(dicts, `${state}.${action}`);
  if (dict) {
    try {
      const prev = getState(state);
      const payload = dict.map(data);

      const processNext = nextValue => (nextValue && nextValue.then ?
          nextValue.then(processNext, dict.error)
          : processAction({ state, action, prev, payload, next: nextValue }));

      processNext(dict.dispatcher(payload, _clone(prev)));
    } catch (e) {
      dict.error(e);
    }
  }
};

export const dispatch = (keyType, data) => (_isArray(keyType) ?
    _forEach(keyType, k => dispatchAction(k, data))
    : dispatchAction(keyType, data));

export const state = getState;

export const reset = () => {
  const initial = _clone(initValues);
  middlewares = initial.middlewares;
  dicts = initial.dicts;
  observers = initial.observers;
  initStore(initial.store);
};

export const init = (options = { middlewares: [], dicts: {}, observers: {}, store: {} }) => {
  initValues = {
    middlewares: options.middlewares || [],
    dicts: options.dicts || {},
    observers: options.observers || {},
    store: options.store || {},
  };
  reset();
};

export const clear = () => clearStore();

export const initState = key => (key ?
    dispatch(_isArray(key) ? _map(key, k => `${k}:INIT`) : `${key}:INIT`)
    : _forEach(_keys(getState()), k => dispatch(`${k}:INIT`)));

export const register = (newDicts) => {
  _assign(dicts, _reduce(newDicts, (result, dict, stateKey) =>
      _set(result, stateKey, _assign({}, baseDict, dict)), {}));
  _forEach(_keys(newDicts), initState);
};
