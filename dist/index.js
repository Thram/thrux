'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetState = exports.state = exports.dispatch = exports.addMiddleware = exports.register = exports.clearObservers = exports.observe = exports.removeObserver = exports.createDict = undefined;

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

var _reduce = require('lodash/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _store = require('./store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var middlewares = [];
var dicts = {},
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

var baseDict = { RESET: createDict(function () {
    return undefined;
  }, function () {
    return undefined;
  }) };

var addObserver = function addObserver(stateKey, funct) {
  return observers[stateKey] = (0, _reduce2.default)([funct], function (result, value) {
    return [].concat(result, [value]);
  }, observers[stateKey] || []);
};

var removeObserver = exports.removeObserver = function removeObserver(stateKey, funct) {
  return (0, _remove2.default)(observers[stateKey], function (value) {
    return value === funct;
  });
};

var processObserver = function processObserver(observer, currentState, actionKey) {
  return setTimeout(function () {
    return observer(currentState, actionKey);
  }, 0);
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
  return (0, _assign2.default)(dicts, (0, _reduce2.default)(newDicts, function (result, dict, stateKey) {
    return (0, _set2.default)(result, stateKey, (0, _assign2.default)({}, baseDict, dict));
  }, {}));
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

var dispatch = exports.dispatch = function dispatch(keyType, data) {
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

var state = exports.state = _store.getState;

var resetState = exports.resetState = function resetState(key) {
  return key ? dispatch(key + ':RESET') : (0, _keys2.default)((0, _store.getState)()).forEach(function (k) {
    return dispatch(k + ':RESET');
  });
};