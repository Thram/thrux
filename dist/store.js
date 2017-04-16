'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setState = exports.getState = exports.clearStore = exports.initStore = undefined;

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = {}; /**
                 * Created by thram on 16/01/17.
                 */
var initStore = exports.initStore = function initStore() {
  var initialValues = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  store = initialValues;
};

var clearStore = exports.clearStore = function clearStore() {
  return initStore();
};

var pickState = function pickState(key) {
  return (0, _isArray3.default)(key) ? (0, _pick3.default)(store, key) : store[key];
};

var getState = exports.getState = function getState(key) {
  return (0, _cloneDeep2.default)(key ? pickState(key) : store);
};

var setState = exports.setState = function setState(key, value) {
  store[key] = value;
};