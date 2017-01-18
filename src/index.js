/**
 * Created by thram on 16/01/17.
 */
import get from 'lodash/get';
import set from 'lodash/set';
import keys from 'lodash/keys';
import reduce from 'lodash/reduce';
import assign from 'lodash/assign';
import isEqual from 'lodash/isEqual';
import {getState, setState} from "./store";

const dicts       = {},
      middlewares = [],
      observers   = {};

export const createDict = (reducer, map = (value) => value, error = (err) => console.error(err)) => ({
  map,
  reducer,
  error
});

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

const processMiddlewares = (status) => middlewares.forEach((middleware) => middleware(assign({}, status)));

export const observe = (stateKey, funct) => addObserver(stateKey, funct);

export const register = (newDicts) => assign(dicts, reduce(newDicts, (result, dict, stateKey) =>
    set(result, stateKey, assign({}, baseDict, dict)), {}));

export const addMiddleware = (middleware) => middlewares.push(middleware);

const processAction = ({state, action, prev, payload, next}) => {
  if (!isEqual(prev, next)) {
    processMiddlewares({state, action, prev, payload, next});
    setState(state, next);
    processObservers(state, next);
  }
};

export const dispatch = (keyType, data) => {
  const [state, action]  = keyType.split(':'),
        dict             = get(dicts, `${state}.${action}`);
  if (dict) {
    try {
      const prev      = getState(state),
            payload   = dict.map(data),
            nextValue = dict.reducer(payload, prev);

      nextValue && nextValue.then ?
          nextValue.then((next) => processAction({state, action, prev, payload, next}), dict.error)
          : processAction({state, action, prev, payload, next: nextValue});
    } catch (e) {
      dict.error(e)
    }
  }
};

export const state = getState;

export const resetState = (key) => key ? dispatch(`${key}:RESET`) : keys(getState()).forEach((k) => dispatch(`${k}:RESET`));