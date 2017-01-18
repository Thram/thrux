/**
 * Created by thram on 17/01/17.
 */

import {register, addMiddleware, dispatch, state, resetState, createDict, observe} from '../src';

jest.useFakeTimers();

register({
  test : {
    TEST_1: createDict(({data}, state) => ({data: data + 1}), (data) => ({data}))
  },
  test2: {
    TEST_1: createDict((data, state) => ({data: data + 2})),
    TEST_2: createDict((data, state) => data.toString())
  },
  test3: {
    TEST_1: createDict((data, state) => new Promise((resolve, reject) => {
      const delay = Math.random() * 2000 + 1000;
      delay > 2000 ? setTimeout(() => resolve({data: data + 3}), delay) : reject('Not enough time!')
    })),
    TEST_2: createDict((data, state) => new Promise((resolve, reject) => {
      const delay = Math.random() * 2000 + 1000;
      delay > 2000 ? setTimeout(() => resolve({data: data + 3}), delay) : reject('Not enough time!')
    }), (err) => console.log('Another error handler', err))
  }
});

addMiddleware((obj) => console.log(obj));

observe('test', (state) => console.log('Observer test:', state));
observe('test', (state) => console.log('Observer test #2:', state));
observe('test', (state) => console.log('Observer test #3:', state));

test('Dispatch "test:TEST_1" and read the new "test" state', () => {
  resetState();
  dispatch('test:TEST_1', 0);
  jest.runAllTimers();
  expect(state('test').data).toBe(1);
});

test('Dispatch "test:TEST_1" again and read the new "test" state', () => {
  resetState();
  dispatch('test:TEST_1', 0);
  dispatch('test:TEST_1', 0);
  dispatch('test:TEST_1', 1);
  jest.runAllTimers();
  expect(state('test').data).toBe(2);
});

test('Dispatch "test2:TEST_1" and read the new "test" state', () => {
  resetState();
  dispatch('test2:TEST_1', 0);
  jest.runAllTimers();
  expect(state('test2').data).toBe(2);
});

test('Dispatch "test:TEST_1" and read the state object', () => {
  dispatch('test:TEST_1', 1);
  jest.runAllTimers();
  expect(state()).toEqual({test: {data: 2}, test2: {data: 2}});
});

test('Dispatch "test2:TEST_2" and make it fail', () => {
  resetState();
  dispatch('test2:TEST_2');
  jest.runAllTimers();
  expect(state('test2')).toBeUndefined();
});

test('Dispatch "test:TEST_1_1" and expect undefined', () => {
  resetState('test');
  dispatch('test:TEST_1_1', 1);
  jest.runAllTimers();
  expect(state('test')).toBeUndefined();
});

test('Dispatch "test3:TEST_1" and expect undefined', () => {
  resetState('test3');
  dispatch('test3:TEST_1', 1);
  jest.runAllTimers();
  observe('test3', (state) => expect(state).toBe(4));
});

test('Dispatch "test3:TEST_2" and expect undefined', () => {
  resetState('test3');
  dispatch('test3:TEST_2', 1);
  jest.runAllTimers();
  observe('test3', (state) => expect(state).toBe(4));
});

test('Clear "test" and expect undefined', () => {
  resetState('test');
  jest.runAllTimers();
  expect(state('test')).toBeUndefined();
});