/**
 * Created by thram on 17/01/17.
 */

import {register, addMiddleware, dispatch, state, clearState, createDict} from '../src';

register({
  test : {
    TEST_INIT: createDict((data) => ({data}), ({data}, state) => ({data: data + 1}))
  },
  test2: {
    TEST_INIT: createDict((data) => ({data}), ({data}, state) => ({data: data + 2}))
  }
});

addMiddleware((obj) => console.log(obj));

test('Dispatch "test:TEST_INIT" and read the new "test" state', () => {
  clearState();
  dispatch('test:TEST_INIT', 0);
  expect(state('test').data).toBe(1);
});

test('Dispatch "test:TEST_INIT" again and read the new "test" state', () => {
  clearState();
  dispatch('test:TEST_INIT', 0);
  dispatch('test:TEST_INIT', 0);
  dispatch('test:TEST_INIT', 1);
  expect(state('test').data).toBe(2);
});

test('Dispatch "test2:TEST_INIT" and read the new "test" state', () => {
  clearState();
  dispatch('test2:TEST_INIT', 0);
  expect(state('test2').data).toBe(2);
});

test('Dispatch "test:TEST_INIT" and read the state object', () => {
  dispatch('test:TEST_INIT', 1);
  expect(state()).toEqual({test: {data: 2}, test2: {data: 2}});
});

test('Dispatch "test:TEST_INIT_1" and expect undefined', () => {
  clearState('test');
  dispatch('test:TEST_INIT_1', 1);
  expect(state('test')).toBeUndefined();
});

test('Clear "test" and expect undefined', () => {
  clearState('test');
  expect(state('test')).toBeUndefined();
});