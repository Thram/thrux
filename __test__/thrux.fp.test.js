/**
 * Created by thram on 16/02/17.
 */
import test from 'tape';
import {
  register,
  addMiddleware,
  dispatch,
  state,
  getActions,
  initState,
  createDict,
  observe,
  removeObserver,
  clearObservers,
  reset
} from '../src/fp';
import { createAPI, createAPIError } from './mock.api';

// Heplers

const getUser = () => createAPI({ user: { name: 'Thram' } });
const getUserError = () => createAPIError('User not found');
const increase = increment => number => number + increment;
const increase1 = increase(1);
const increase2 = increase(2);

const initCounterAction = () => 0;
const increaseAction = (payload, stateValue) => increase(payload)(stateValue);
const increase1Action = (payload, stateValue) => increase1(stateValue);
const increase2Action = (payload, stateValue) => increase2(stateValue);

test('FP: Create dictionary', (assert) => {
  const dispatcher = () => console.log('dispatcher');
  const map = () => console.log('map');
  const error = () => console.log('error');
  const expected = createDict(dispatcher, map, error);
  const actual = { dispatcher, map, error };

  assert.deepEqual(expected, actual, 'Dictionary created');
  assert.end();
});

test('FP: Register state', (assert) => {
  const user = { INIT: createDict(() => 'Thram') };
  register({ user });

  const expected = true;
  const actual = Object.prototype.hasOwnProperty.call(state(), 'user');
  assert.equal(actual, expected, 'State registered');
  assert.end();
});

test('FP: Get actions', (assert) => {
  reset();
  const init = createDict(() => 'Thram');
  const user = { INIT: init };
  const user2 = { INIT: init };
  register({ user, user2 });
  const expected = ['user:INIT', 'user2:INIT'];
  const actual = getActions();
  assert.deepEqual(actual, expected, 'Get registered actions');
  assert.end();
});

test("Get user state's actions", (assert) => {
  reset();
  const init = createDict(() => 'Thram');
  const user = { INIT: init, TEST: init };
  const user2 = { INIT: init };
  register({ user, user2 });
  const expected = ['user:INIT', 'user:TEST'];
  const actual = getActions('user');
  assert.deepEqual(actual, expected, "Get user's actions");
  assert.end();
});

test('FP: Reset store', (assert) => {
  reset();
  const expected = {};
  const actual = state();
  assert.deepEqual(actual, expected, 'Store reset');
  assert.end();
});

test('FP: State initialization', (assert) => {
  const user = { INIT: createDict(() => 'Thram') };
  register({ user });

  const expected = 'Thram';
  const actual = state('user');
  assert.equal(actual, expected, 'State initialized');
  assert.end();
});

test('FP: Get multiple states', (assert) => {
  reset();
  const counter = {
    INIT: createDict(initCounterAction),
    INCREASE: createDict(increase1Action),
  };
  const counter2 = {
    INIT: createDict(initCounterAction),
    INCREASE: createDict(increase2Action),
  };
  register({ counter, counter2 });
  dispatch(['counter:INCREASE', 'counter2:INCREASE'])();
  const expected = { counter: 1, counter2: 2 };
  const actual = state(['counter', 'counter2']);
  assert.deepEqual(actual, expected, 'States values correct');
  assert.end();
});

test('FP: Dispatch an action', (assert) => {
  reset();
  const counter = {
    INIT: createDict(initCounterAction),
    INCREASE: createDict(increaseAction),
  };
  register({ counter });
  dispatch('counter:INCREASE')(4);
  const expected = 4;
  const actual = state('counter');
  assert.equal(actual, expected, 'Action dispatched');
  assert.end();
});

test('FP: Dispatch an undefined action', (assert) => {
  reset();
  const counter = {
    INIT: createDict(initCounterAction),
    INCREASE: createDict(increase1Action),
  };
  register({ counter });
  dispatch('counter:DECREASE')();
  const expected = 0;
  const actual = state('counter');
  assert.equal(actual, expected, "State doesn't change");
  assert.end();
});

test('FP: Dispatch multiple actions', (assert) => {
  reset();
  const counter = {
    INIT: createDict(initCounterAction),
    INCREASE: createDict(increase1Action),
  };
  const counter2 = {
    INIT: createDict(initCounterAction),
    INCREASE: createDict(increase2Action),
  };
  register({ counter, counter2 });
  dispatch(['counter:INCREASE', 'counter2:INCREASE'])();
  const expected = { counter: 1, counter2: 2 };
  const actual = { counter: state('counter'), counter2: state('counter2') };
  assert.deepEqual(actual, expected, 'Actions dispatched');
  assert.end();
});

test('FP: Dispatch an action that fails without catching the error', (assert) => {
  reset();
  const counter = {
    INIT: createDict(initCounterAction),
    INCREASE: createDict(increase1Action, ({ value }) => value),
  };
  register({ counter });
  dispatch('counter:INCREASE')();
  setTimeout(() => {
    assert.pass('Error logged but code keeps running');
    assert.end();
  }, 200);
});

test('FP: Dispatch an action with promise', (assert) => {
  reset();
  const user = { SIGN_IN: createDict(() => ({ user: { name: 'Thram' } })) };
  register({ user });
  const oUser = observe('user');
  oUser((actual) => {
    const expected = { user: { name: 'Thram' } };
    assert.deepEqual(actual, expected, 'Promise resolve correctly');
    assert.end();
  });
  dispatch('user:SIGN_IN')();
});

test('FP: Micro observer', (assert) => {
  reset();
  const user = { SIGN_IN: createDict(getUser) };
  register({ user });
  const oUserName = observe('user.user.name');
  oUserName((actual) => {
    const expected = 'Thram';
    assert.deepEqual(actual, expected, 'Promise resolve correctly with micro observer');
    assert.end();
  });
  dispatch('user:SIGN_IN')();
});

test('FP: Micro observer dont change', (assert) => {
  reset();
  const user = {
    INIT: createDict(() => ({ user: { name: 'Thram' } })),
    SIGN_IN: createDict(() => ({ user: { name: 'Thram', lang: 'javascript' } })),
  };
  register({ user });
  const oUserName = observe('user.user.name');
  oUserName(() => assert.error());
  dispatch('user:SIGN_IN')();
  setTimeout(() => {
    assert.pass('Observe not executed');
    assert.end();
  }, 1000);
});

test('FP: Dispatch an action with promise that fails', (assert) => {
  reset();
  clearObservers(['user']);
  const user = {
    SIGN_IN: createDict(getUserError, payload => payload && payload.user, (actual) => {
      const expected = { error: 'User not found' };
      assert.deepEqual(actual, expected, 'Promise failed');
      assert.end();
    }),
  };
  register({ user });
  dispatch('user:SIGN_IN')();
});

test('FP: Dispatch an action that fails and catch the error', (assert) => {
  reset();
  const counter = {
    INIT: createDict(initCounterAction),
    INCREASE: createDict(
      increase1Action,
      ({ value }) => value, (actual) => {
        const expected = "Cannot read property 'value' of undefined";
        assert.equal(actual.message, expected, 'Action failed');
        assert.end();
      }),
  };
  register({ counter });
  dispatch('counter:INCREASE')();
});

test('FP: Initialize state manually', (assert) => {
  reset();
  const counter = {
    INIT: createDict(initCounterAction),
    INCREASE: createDict(increase1Action),
  };
  register({ counter });
  dispatch('counter:INCREASE')();
  initState('counter');
  const expected = 0;
  const actual = state('counter');
  assert.equal(actual, expected, 'State initialized manually');
  assert.end();
});

test('FP: Initialize manually multiple states', (assert) => {
  reset();
  const counter = {
    INIT: createDict(initCounterAction),
    INCREASE: createDict(increase1Action),
  };
  const counter2 = {
    INIT: createDict(initCounterAction),
    INCREASE: createDict(increase2Action),
  };
  register({ counter, counter2 });
  dispatch(['counter:INCREASE', 'counter2:INCREASE'])();
  initState(['counter', 'counter2']);
  const expected = { counter: 0, counter2: 0 };
  const actual = state(['counter', 'counter2']);
  assert.deepEqual(actual, expected, 'Action dispatched');
  assert.end();
});

test('FP: Initialize manually all states', (assert) => {
  reset();
  const counter = {
    INIT: createDict(initCounterAction),
    INCREASE: createDict(increase1Action),
  };
  const counter2 = {
    INIT: createDict(initCounterAction),
    INCREASE: createDict(increase2Action),
  };
  register({ counter, counter2 });
  dispatch(['counter:INCREASE', 'counter2:INCREASE'])();
  initState();
  const expected = { counter: 0, counter2: 0 };
  const actual = state(['counter', 'counter2']);
  assert.deepEqual(actual, expected, 'Actions dispatched');
  assert.end();
});

test('FP: Observe state change', (assert) => {
  reset();
  const counter = {
    INIT: createDict(initCounterAction),
    INCREASE: createDict(increase1Action),
  };
  register({ counter });
  const oCounter = observe('counter');
  oCounter((actual) => {
    const expected = 1;
    assert.equal(actual, expected, 'State changed');
    assert.end();
  });
  dispatch('counter:INCREASE')();
});

test('FP: Remove observer, observe should not trigger', (assert) => {
  reset();
  const testActions = {
    INIT: createDict(() => 'foo', val => val),
    CHANGE: createDict(() => 'bar', val => val),
  };
  const check = () => assert.error();
  register({ test: testActions });
  const oTest = observe('test');
  oTest(check);
  removeObserver('test')(check);
  dispatch('test:CHANGE')();
  setTimeout(() => {
    assert.pass('Observe not executed');
    assert.end();
  }, 200);
});
test('FP: Remove wrong observer, observe should trigger', (assert) => {
  reset();
  const testActions = {
    INIT: createDict(() => 'foo', val => val),
    CHANGE: createDict(() => 'bar', val => val),
  };
  const check = () => assert.error();
  register({ test: testActions });
  observe('test')(() => {
    assert.pass('Observe trigger correctly');
    assert.end();
  });
  removeObserver('test2')(check);
  dispatch('test:CHANGE')();
});

test('FP: Remove micro observer, observe should not trigger', (assert) => {
  reset();
  const testActions = {
    INIT: createDict(() => ({ value: 'foo' })),
    CHANGE: createDict(() => ({ value: 'bar' })),
  };
  const check = () => assert.error();
  register({ test: testActions });
  observe('test.value')(check);
  removeObserver('test.value')(check);
  dispatch('test:CHANGE')();
  setTimeout(() => {
    assert.pass('Observe not executed');
    assert.end();
  }, 200);
});

test('FP: Clear observers', (assert) => {
  reset();
  const testActions = { INIT: createDict(() => 'test') };
  const check = () => assert.error();
  const check2 = () => assert.error();
  register({ test: testActions });
  observe('test')(check);
  observe('test')(check2);
  clearObservers('test');
  dispatch('test:INIT')();
  setTimeout(() => {
    assert.pass('Observers not executed');
    assert.end();
  }, 200);
});

test('FP: Clear multiple states observers', (assert) => {
  reset();
  const testActions = { INIT: createDict(() => 'test') };
  const testActions2 = { INIT: createDict(() => 'test2') };
  const check = () => assert.error();
  const check2 = () => assert.error();
  register({ test: testActions, test2: testActions2 });
  observe('test')(check);
  observe('test')(check2);
  observe('test2')(check);
  observe('test2')(check2);
  clearObservers(['test', 'test2']);
  dispatch('test:INIT')();
  dispatch('test2:INIT')();
  setTimeout(() => {
    assert.pass('Observers not executed');
    assert.end();
  }, 200);
});

test('FP: Add middlewares', (assert) => {
  reset();
  const counter = {
    INIT: createDict(initCounterAction),
    INCREASE: createDict(increase1Action),
  };
  register({ counter });
  let processed = 0;

  const check = (actual) => {
    processed += 1;
    if (processed === 3) {
      const expected = {
        action: 'INCREASE',
        next: 1,
        payload: undefined,
        prev: 0,
        state: 'counter',
      };
      assert.deepEqual(actual, expected, `${processed} Middlewares correctly processed`);
      assert.end();
    }
  };
  addMiddleware(check);
  addMiddleware([check, check]);
  dispatch('counter:INCREASE')();
});
