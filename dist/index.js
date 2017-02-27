'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initState = exports.reset = exports.state = exports.dispatch = exports.addMiddleware = exports.register = exports.clearObservers = exports.observe = exports.removeObserver = exports.createDict = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Created by thram on 16/01/17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */


var _remove = require('lodash/remove');

var _remove2 = _interopRequireDefault(_remove);

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

var _es6Promise = require('es6-promise');

var _store = require('./store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  return observers[stateKey] = (0, _reduce2.default)([funct], function (result, value) {
    return [].concat(result, [value]);
  }, observers[stateKey] || []);
};

var removeObserver = exports.removeObserver = function removeObserver(stateKey, funct) {
  return (0, _remove2.default)(observers[stateKey], function (value) {
    return (0, _isEqual2.default)(value, funct);
  });
};

var processObserver = function processObserver(observer, currentState, actionKey) {
  return new _es6Promise.Promise(function (resolve, reject) {
    return observer(currentState, actionKey), resolve();
  });
};

var processObservers = function processObservers(stateKey, currentState, actionKey) {
  var stateObservers = observers[stateKey];
  if (stateObservers && stateObservers.length > 0) stateObservers.forEach(function (observer) {
    return processObserver(observer, currentState, actionKey);
  });
};

var processMiddlewares = function processMiddlewares(status) {
  return middlewares.forEach(function (middleware) {
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
  (0, _keys2.default)(newDicts).forEach(initState);
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
    processObservers(state, (0, _cloneDeep2.default)(next), action);
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
  return (0, _isArray2.default)(keyType) ? keyType.forEach(function (k) {
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
  }) : key + ':INIT') : (0, _keys2.default)((0, _store.getState)()).forEach(function (k) {
    return dispatch(k + ':INIT');
  });
};