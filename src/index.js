/**
 * Created by thram on 16/01/17.
 */
import set from 'lodash/set';
import keys from 'lodash/keys';
import reduce from 'lodash/reduce';
import assign from 'lodash/assign';
import isEqual from 'lodash/isEqual';
import {getState, setState} from "./store";

const dicts       = {},
      middlewares = [],
      observers   = {};

export const createDict = (map, reducer) => ({map, reducer});

const baseDict = {RESET: createDict(() => undefined, () => undefined)};

const addObserver = (stateKey, funct) => observers[stateKey] = reduce([funct],
    (result, value) => [].concat(result, [value]),
    observers[stateKey] || []);

const processObserver = (observer, currentState) => setTimeout(() => observer(currentState), 0);

const processObservers = (stateKey, currentState) => {
  const stateObservers = observers[stateKey];
  if (stateObservers && stateObservers.length > 0)
    stateObservers.forEach((observer) => processObserver(observer, currentState));
};

const processMiddlewares = (status) => middlewares.forEach((middleware) => middleware(status));

export const observe = (stateKey, funct) => addObserver(stateKey, funct);

export const register = (newDicts) => assign(dicts, reduce(newDicts, (result, dict, stateKey) =>
    set(result, stateKey, assign({}, baseDict, dict)), {}));

export const addMiddleware = (middleware) => middlewares.push(middleware);

export const dispatch = (keyType, data) => {
  const [key, type]  = keyType.split(':'),
        dict         = dicts[key],
        action       = dict && dict[type];
  if (action) {
    const prevValue = getState(key),
          value     = action.map(data),
          nextValue = action.reducer(value);
    if (!isEqual(prevValue, nextValue)) {
      processMiddlewares({
        state  : key,
        action : type,
        prev   : prevValue,
        payload: value,
        next   : nextValue
      });
      setState(key, nextValue);
      processObservers(key, nextValue);
    }
  }
};

export const state = getState;

export const resetState = (key) => key ? dispatch(`${key}:RESET`) : keys(getState()).forEach((k) => dispatch(`${k}:RESET`));