'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initState = exports.reset = exports.state = exports.dispatch = exports.addMiddleware = exports.register = exports.clearObservers = exports.observe = exports.removeObserver = exports.createDict = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _remove2 = require('lodash/remove');

var _remove3 = _interopRequireDefault(_remove2);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _set = require('lodash/set');

var _set2 = _interopRequireDefault(_set);

var _keys = require('lodash/keys');

var _keys2 = _interopRequireDefault(_keys);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _reduce = require('lodash/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _es6Promise = require('es6-promise');

var _store = require('./store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); } /**
                                                                               * Created by thram on 16/01/17.
                                                                               */


var middlewares = [],
    dicts = {},
    observers = {};

var createDict = exports.createDict = function createDict(reducer) {
  var map = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (value) {
    return value;
  };
  var error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (err) {
    return console.error(err);
  };
  return {
    map: map,
    reducer: reducer,
    error: error
  };
};

var baseDict = {
  INIT: createDict(function () {
    return undefined;
  })
};

var addObserver = function addObserver(stateKey, funct) {
  var _stateKey$match = stateKey.match(/.+?(?=\.|\[+]|$)/g),
      _stateKey$match2 = _toArray(_stateKey$match),
      mainState = _stateKey$match2[0],
      rest = _stateKey$match2.slice(1);

  observers[mainState] = observers[mainState] || { _global: [] };
  var _add = function _add(key) {
    return observers[mainState][key] = (0, _reduce2.default)([funct], function (result, value) {
      return [].concat(result, [value]);
    }, observers[mainState][key] || []);
  };

  rest.length > 0 ? _add(rest.join('')) : _add('_global');
};

var removeObserver = exports.removeObserver = function removeObserver(stateKey, funct) {
  var _stateKey$match3 = stateKey.match(/.+?(?=\.|\[+]|$)/g),
      _stateKey$match4 = _toArray(_stateKey$match3),
      mainState = _stateKey$match4[0],
      rest = _stateKey$match4.slice(1);

  var _remove = function _remove(key) {
    return (0, _remove3.default)(observers[mainState][key], function (value) {
      return (0, _isEqual2.default)(value, funct);
    });
  };

  rest.length > 0 ? _remove(rest.join('')) : _remove('_global');
};

var processObserver = function processObserver(observer, currentState, actionKey) {
  return new _es6Promise.Promise(function (resolve, reject) {
    return observer(currentState, actionKey), resolve();
  });
};

var processObservers = function processObservers(stateKey, currentState, actionKey, prev) {
  var stateObservers = observers[stateKey],
      _process = function _process(observers, key) {
    observers && observers.length > 0 && (key === '_global' || !(0, _isEqual2.default)((0, _get2.default)(prev, '' + stateKey + key), (0, _get2.default)(currentState, '' + stateKey + key))) && (0, _forEach2.default)(observers, function (observer) {
      return processObserver(observer, key === '_global' ? currentState : (0, _get2.default)(currentState, '' + stateKey + key), actionKey);
    });
  };
  (0, _forEach2.default)(stateObservers, _process);
};

var processMiddlewares = function processMiddlewares(status) {
  return (0, _forEach2.default)(middlewares, function (middleware) {
    return middleware(status);
  });
};

var observe = exports.observe = function observe(stateKey, funct) {
  return addObserver(stateKey, funct);
};

var clearObservers = exports.clearObservers = function clearObservers(stateKey) {
  return observers[stateKey] = undefined;
};

var register = exports.register = function register(newDicts) {
  (0, _assign2.default)(dicts, (0, _reduce2.default)(newDicts, function (result, dict, stateKey) {
    return (0, _set2.default)(result, stateKey, (0, _assign2.default)({}, baseDict, dict));
  }, {}));
  (0, _forEach2.default)((0, _keys2.default)(newDicts), initState);
};

var addMiddleware = exports.addMiddleware = function addMiddleware(middleware) {
  return (0, _isArray2.default)(middleware) ? middlewares = [].concat(middlewares, middleware) : middlewares.push(middleware);
};

var processAction = function processAction(_ref) {
  var state = _ref.state,
      action = _ref.action,
      prev = _ref.prev,
      payload = _ref.payload,
      next = _ref.next;

  if (!(0, _isEqual2.default)(prev, next)) {
    processMiddlewares({ state: state, action: action, prev: prev, payload: payload, next: (0, _cloneDeep2.default)(next) });
    (0, _store.setState)(state, next);
    processObservers(state, (0, _cloneDeep2.default)(next), action, prev);
  }
};

var dispatchAction = function dispatchAction(keyType, data) {
  var _keyType$split = keyType.split(':'),
      _keyType$split2 = _slicedToArray(_keyType$split, 2),
      state = _keyType$split2[0],
      action = _keyType$split2[1],
      dict = (0, _get2.default)(dicts, state + '.' + action);

  if (dict) {
    try {
      (function () {
        var prev = (0, _store.getState)(state),
            payload = dict.map(data);

        var processNext = function processNext(nextValue) {
          return nextValue && nextValue.then ? nextValue.then(processNext, dict.error) : processAction({ state: state, action: action, prev: prev, payload: payload, next: nextValue });
        };

        processNext(dict.reducer(payload, (0, _cloneDeep2.default)(prev)));
      })();
    } catch (e) {
      dict.error(e);
    }
  }
};
var dispatch = exports.dispatch = function dispatch(keyType, data) {
  return (0, _isArray2.default)(keyType) ? (0, _forEach2.default)(keyType, function (k) {
    return dispatchAction(k, data);
  }) : dispatchAction(keyType, data);
};

var state = exports.state = _store.getState;

var reset = exports.reset = function reset() {
  middlewares = [];
  dicts = {};
  observers = {};
  (0, _store.clearStore)();
};

var initState = exports.initState = function initState(key) {
  return key ? dispatch((0, _isArray2.default)(key) ? (0, _map2.default)(key, function (k) {
    return k + ':INIT';
  }) : key + ':INIT') : (0, _forEach2.default)((0, _keys2.default)((0, _store.getState)()), function (k) {
    return dispatch(k + ':INIT');
  });
};