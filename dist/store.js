'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setState = exports.getState = undefined;

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by thram on 16/01/17.
 */
var store = {};

var getState = exports.getState = function getState(key) {
  return key ? (0, _isArray2.default)(key) ? (0, _pick2.default)(store, key) : store[key] : store;
};
var setState = exports.setState = function setState(key, value) {
  return store[key] = value;
};