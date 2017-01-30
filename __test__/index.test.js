/**
 * Created by thram on 17/01/17.
 */

import {
  register,
  addMiddleware,
  dispatch,
  state,
  resetState,
  createDict,
  observe,
  removeObserver,
  clearObservers
} from '../src';

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
      setTimeout(() => reject('Async Error!'), delay)
    })),
    TEST_2: createDict((data, state) => new Promise((resolve, reject) => {
      const delay = Math.random() * 2000 + 1000;
      setTimeout(() => resolve({data: data + 3}), delay)
    }), (data) => ({data}), (err) => console.log('Another error handler', err)),
    TEST_3: createDict((data, state) => new Promise((resolve, reject) => {
      const delay = Math.random() * 2000 + 1000;
      data += 1;
      console.log('Resolve first promise', data);
      setTimeout(() => resolve(new Promise((resolve, reject) => {
        const delay = Math.random() * 2000 + 1000;
        console.log('Resolve second promise', data);
        setTimeout(() => resolve({data: data + 3}), delay)
      })), delay)
    }))
  }
});

// Logger
addMiddleware([({prev}) => console.log('console prev:', prev), ({next}) => console.log('console next:', next)]);


test('Test observers', () => {
  clearObservers('test');
  resetState();
  observe('test', (state, actionKey) => {
    console.log('Action', actionKey);
    expect(state.data).toBe(1)
  });
  dispatch('test:TEST_1', 0);
  jest.runAllTimers();
});

test('Test remove observer', () => {
  clearObservers('test');
  resetState();
  const doNotConsole = (state) => console.log('Do Not console this');
  observe('test', doNotConsole);
  removeObserver('test', doNotConsole);
  dispatch('test:TEST_1', 0);
  expect(state('test').data).toBe(1);
  jest.runAllTimers();
});

test('Dispatch "test:TEST_1" and read the new "test" state', () => {
  clearObservers('test');
  resetState();
  dispatch('test:TEST_1', 0);
  jest.runAllTimers();
  expect(state('test').data).toBe(1);
});

test('Dispatch "test:TEST_1" again and read the new "test" state', () => {
  clearObservers('test');
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

test('Dispatch "test3:TEST_2" and expect 4', () => {
  resetState('test3');
  dispatch('test3:TEST_2', 1);
  jest.runAllTimers();
  observe('test3', (state) => expect(state).toBe(4));
});

test('Dispatch "test3:TEST_3" and expect 4', () => {
  resetState('test3');
  dispatch('test3:TEST_3', 1);
  jest.runAllTimers();
  observe('test3', (state) => expect(state).toBe(5));
});

test('Clear "test" and expect undefined', () => {
  resetState('test');
  jest.runAllTimers();
  expect(state('test')).toBeUndefined();
});

test('Test that middleware does not affect the state', () => {
  clearObservers('test');
  resetState();
  addMiddleware((obj) => obj.next && (obj.next.data = obj.next.data + 1));
  dispatch('test:TEST_1', 0);
  jest.runAllTimers();
  expect(state('test').data).toBe(1);
});