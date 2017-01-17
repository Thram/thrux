'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDict = exports.clearState = exports.state = exports.dispatch = exports.addMiddleware = exports.register = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Created by thram on 16/01/17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */


var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _store = require('./store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dicts = {},
    middlewares = [];

var register = exports.register = function register(newDicts) {
  return Object.assign(dicts, newDicts);
};

var addMiddleware = exports.addMiddleware = function addMiddleware(middleware) {
  return middlewares.push(middleware);
};

var dispatch = exports.dispatch = function dispatch(keyType, data) {
  var _keyType$split = keyType.split(':'),
      _keyType$split2 = _slicedToArray(_keyType$split, 2),
      key = _keyType$split2[0],
      type = _keyType$split2[1],
      dict = dicts[key],
      action = dict && dict[type];

  if (action) {
    (function () {
      var prevValue = (0, _store.getState)(key),
          value = action.map(data),
          nextValue = action.reducer(value);
      if (!(0, _isEqual2.default)(prevValue, nextValue)) {
        middlewares.forEach(function (middleware) {
          return middleware({
            state: key,
            action: type,
            prev: prevValue,
            payload: value,
            next: nextValue
          });
        });
        (0, _store.setState)(key, nextValue);
      }
    })();
  }
};

var state = exports.state = _store.getState;

var clearState = exports.clearState = _store.resetState;

var createDict = exports.createDict = function createDict(map, reducer) {
  return { map: map, reducer: reducer };
};