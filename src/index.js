/**
 * Created by thram on 16/01/17.
 */

import {getState, setState} from "./store";

setState('test', 'Test!');

function test() {
  return getState('test');
}

function test2() {
  return getState();
}

export default {
  test,
  test2
};