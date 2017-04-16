'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.initState = exports.clear = exports.init = exports.reset = exports.state = exports.dispatch = exports.addMiddleware = exports.getActions = exports.clearObservers = exports.observe = exports.removeObserver = exports.createDict = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _remove2 = require('lodash/remove');

var _remove3 = _interopRequireDefault(_remove2);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _set2 = require('lodash/set');

var _set3 = _interopRequireDefault(_set2);

var _keys2 = require('lodash/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _reduce2 = require('lodash/reduce');

var _reduce3 = _interopRequireDefault(_reduce2);

var _assign2 = require('lodash/assign');

var _assign3 = _interopRequireDefault(_assign2);

var _isEqual2 = require('lodash/isEqual');

var _isEqual3 = _interopRequireDefault(_isEqual2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _forEach2 = require('lodash/forEach');

var _forEach3 = _interopRequireDefault(_forEach2);

var _store = require('./store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); } /**
                                                                               * Created by thram on 16/01/17.
                                                                               */


var initValues = { middlewares: [], dicts: {}, observers: {}, store: {} };
var middlewares = [];
var dicts = {};
var observers = {};

var cleanKey = function cleanKey(key) {
  return (/\.?(.*)$/.exec(key)[1]
  );
};

var defaultMap = function defaultMap(value) {
  return value;
};
var defaultError = function defaultError(err) {
  return console.error(err);
};

var createDict = exports.createDict = function createDict(dispatcher) {
  var map = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultMap;
  var error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultError;
  return {
    dispatcher: dispatcher,
    map: map,
    error: error
  };
};

var baseDict = { INIT: createDict(function () {
    return undefined;
  }) };

var addObserver = function addObserver(stateKey, funct) {
  var _stateKey$match = stateKey.match(/.+?(?=\.|\[+]|$)/g),
      _stateKey$match2 = _toArray(_stateKey$match),
      mainState = _stateKey$match2[0],
      rest = _stateKey$match2.slice(1);

  observers[mainState] = observers[mainState] || { _global: [] };

  var key = rest.length > 0 ? rest.join('') : '_global';

  observers[mainState][key] = (0, _reduce3.default)([funct], function (result, value) {
    return [].concat(result, [value]);
  }, observers[mainState][key] || []);
};

var removeObserver = exports.removeObserver = function removeObserver(stateKey, funct) {
  var _stateKey$match3 = stateKey.match(/.+?(?=\.|\[+]|$)/g),
      _stateKey$match4 = _toArray(_stateKey$match3),
      mainState = _stateKey$match4[0],
      rest = _stateKey$match4.slice(1);

  var key = rest.length > 0 ? rest.join('') : '_global';

  if (observers[mainState]) {
    (0, _remove3.default)(observers[mainState][key], function (value) {
      return (0, _isEqual3.default)(value, funct);
    });
  }
};

var processObserver = function processObserver(observer, currentState, actionKey) {
  return new Promise(function (resolve) {
    observer(currentState, actionKey);
    resolve();
  });
};

var processObservers = function processObservers(_ref) {
  var stateKey = _ref.stateKey,
      currentState = _ref.currentState,
      actionKey = _ref.actionKey,
      prev = _ref.prev;

  var stateObservers = observers[stateKey];
  var hasChanged = function hasChanged(key) {
    return !(0, _isEqual3.default)((0, _get3.default)(prev, '' + key), (0, _get3.default)(currentState, '' + key));
  };
  var mustProcess = function mustProcess(key) {
    return key === '_global' || hasChanged(key);
  };
  var process = function process(sObservers, key) {
    var cleanedKey = cleanKey(key);
    if (sObservers && sObservers.length > 0 && mustProcess(cleanedKey)) {
      (0, _forEach3.default)(sObservers, function (observer) {
        return processObserver(observer, key === '_global' ? currentState : (0, _get3.default)(currentState, '' + cleanedKey), actionKey);
      });
    }
  };
  (0, _forEach3.default)(stateObservers, process);
};

var processMiddlewares = function processMiddlewares(status) {
  return (0, _forEach3.default)(middlewares, function (middleware) {
    return middleware(status);
  });
};

var observe = exports.observe = function observe(stateKey, funct) {
  return addObserver(stateKey, funct);
};

var clearObservers = exports.clearObservers = function clearObservers(stateKey) {
  observers[stateKey] = undefined;
};

var getActions = exports.getActions = function getActions(stateKeys) {
  var getStateActions = function getStateActions(state) {
    return (0, _map3.default)((0, _keys3.default)(dicts[state]), function (action) {
      return state + ':' + action;
    });
  };
  return stateKeys ? getStateActions(stateKeys) : (0, _reduce3.default)(dicts, function (result, _dict, state) {
    return result.concat(getStateActions(state));
  }, []);
};

var addMiddleware = exports.addMiddleware = function addMiddleware(middleware) {
  middlewares = [].concat(middlewares, middleware);
};

var processAction = function processAction(_ref2) {
  var state = _ref2.state,
      action = _ref2.action,
      prev = _ref2.prev,
      payload = _ref2.payload,
      next = _ref2.next;

  if (!(0, _isEqual3.default)(prev, next)) {
    processMiddlewares({ state: state, action: action, prev: prev, payload: payload, next: (0, _cloneDeep2.default)(next) });
    (0, _store.setState)(state, next);
    processObservers({ stateKey: state, currentState: (0, _cloneDeep2.default)(next), actionKey: action, prev: prev });
  }
};

var dispatchAction = function dispatchAction(keyType, data) {
  var _keyType$split = keyType.split(':'),
      _keyType$split2 = _slicedToArray(_keyType$split, 2),
      state = _keyType$split2[0],
      action = _keyType$split2[1];

  var dict = (0, _get3.default)(dicts, state + '.' + action);
  if (dict) {
    try {
      var prev = (0, _store.getState)(state);
      var payload = dict.map(data);

      var processNext = function processNext(nextValue) {
        return nextValue && nextValue.then ? nextValue.then(processNext, dict.error) : processAction({ state: state, action: action, prev: prev, payload: payload, next: nextValue });
      };

      processNext(dict.dispatcher(payload, (0, _cloneDeep2.default)(prev)));
    } catch (e) {
      dict.error(e);
    }
  }
};

var dispatch = exports.dispatch = function dispatch(keyType, data) {
  return (0, _isArray3.default)(keyType) ? (0, _forEach3.default)(keyType, function (k) {
    return dispatchAction(k, data);
  }) : dispatchAction(keyType, data);
};

var state = exports.state = _store.getState;

var reset = exports.reset = function reset() {
  var initial = (0, _cloneDeep2.default)(initValues);
  middlewares = initial.middlewares;
  dicts = initial.dicts;
  observers = initial.observers;
  (0, _store.initStore)(initial.store);
};

var init = exports.init = function init() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { middlewares: [], dicts: {}, observers: {}, store: {} };

  initValues = {
    middlewares: options.middlewares || [],
    dicts: options.dicts || {},
    observers: options.observers || {},
    store: options.store || {}
  };
  reset();
};

var clear = exports.clear = function clear() {
  return (0, _store.clearStore)();
};

var initState = exports.initState = function initState(key) {
  return key ? dispatch((0, _isArray3.default)(key) ? (0, _map3.default)(key, function (k) {
    return k + ':INIT';
  }) : key + ':INIT') : (0, _forEach3.default)((0, _keys3.default)((0, _store.getState)()), function (k) {
    return dispatch(k + ':INIT');
  });
};

var register = exports.register = function register(newDicts) {
  (0, _assign3.default)(dicts, (0, _reduce3.default)(newDicts, function (result, dict, stateKey) {
    return (0, _set3.default)(result, stateKey, (0, _assign3.default)({}, baseDict, dict));
  }, {}));
  (0, _forEach3.default)((0, _keys3.default)(newDicts), initState);
};