"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by thram on 16/01/17.
 */
var store = {};

var getState = exports.getState = function getState(key) {
  return key ? store[key] : store;
};
var setState = exports.setState = function setState(key, value) {
  return store[key] = value;
};
var resetState = exports.resetState = function resetState(key) {
  return key ? store[key] = undefined : store = {};
};