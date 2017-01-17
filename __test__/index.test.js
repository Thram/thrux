/**
 * Created by thram on 17/01/17.
 */

import {register, dispatch, state, clearState} from '../src';

register('test', {
  TEST_INIT: {
    map    : (data) => ({data}),
    reducer: ({data}, state) => ({data: data + 1})
  },
});

test('Dispatch "test" data and read the new "test" state', () => {
  clearState();
  dispatch('test', 'TEST_INIT', 0);
  expect(state('test').data).toBe(1);
});

test('Dispatch "test" data and read the state object', () => {
  clearState();
  dispatch('test', 'TEST_INIT', 0);
  expect(state()).toEqual({test: {data: 1}});
});

test('Clear "test" and expect undefined', () => {
  clearState('test');
  expect(state('test')).toBeUndefined();
});
// test('Test 2 thrux', () => expect(thrux.test2()).toEqual({test: 'Test!'}));