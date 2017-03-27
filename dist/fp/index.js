'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = exports.initState = exports.reset = exports.state = exports.dispatch = exports.addMiddleware = exports.getActions = exports.clearObservers = exports.observe = exports.removeObserver = exports.createDict = undefined;

var _index = require('../index');

var createDict = exports.createDict = _index.createDict; /**
                                                          * Created by thram on 16/01/17.
                                                          */
var removeObserver = exports.removeObserver = function removeObserver(stateKey) {
  return function (funct) {
    return (0, _index.removeObserver)(stateKey, funct);
  };
};

var observe = exports.observe = function observe(stateKey) {
  return function (funct) {
    return (0, _index.observe)(stateKey, funct);
  };
};

var clearObservers = exports.clearObservers = _index.clearObservers;

var getActions = exports.getActions = _index.getActions;

var addMiddleware = exports.addMiddleware = _index.addMiddleware;

var dispatch = exports.dispatch = function dispatch(keyType) {
  return function (data) {
    return (0, _index.dispatch)(keyType, data);
  };
};

var state = exports.state = _index.state;

var reset = exports.reset = _index.reset;

var initState = exports.initState = _index.initState;

var register = exports.register = _index.reset;