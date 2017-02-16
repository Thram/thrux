/**
 * Created by thram on 16/02/17.
 */
import test from "tape";
import {
  register,
  addMiddleware,
  dispatch,
  state,
  initState,
  createDict,
  observe,
  removeObserver,
  clearObservers,
  reset
} from '../src';
import {createAPI, createAPIError} from "./mock.api";

// Heplers

const getUser      = () => createAPI({user: {name: 'Thram'}}),
      getUserError = () => createAPIError('User not found');

test('Create dictionary', (assert) => {
  const reducer  = () => console.log('reducer'),
        map      = () => console.log('map'),
        error    = () => console.log('error');
  const expected = createDict(reducer, map, error),
        actual   = {reducer, map, error};

  assert.deepEqual(expected, actual, 'Dictionary created');
  assert.end();
});

test('Register state', (assert) => {
  const user = {INIT: createDict(() => 'Thram')};
  register({user});

  const expected = true,
        actual   = state().hasOwnProperty('user');
  assert.equal(actual, expected, 'State registered');
  assert.end();
});

test('Reset store', (assert) => {
  reset();
  const expected = {},
        actual   = state();
  assert.deepEqual(actual, expected, 'Store reset');
  assert.end();
});

test('State initialization', (assert) => {
  const user = {INIT: createDict(() => 'Thram')};
  register({user});

  const expected = 'Thram',
        actual   = state('user');
  assert.equal(actual, expected, 'State initialized');
  assert.end();
});

test('Get multiple states', (assert) => {
  reset();
  const counter  = {
    INIT    : createDict(() => 0),
    INCREASE: createDict((payload, state) => state + 1)
  };
  const counter2 = {
    INIT    : createDict(() => 0),
    INCREASE: createDict((payload, state) => state + 2)
  };
  register({counter, counter2});
  dispatch(['counter:INCREASE', 'counter2:INCREASE']);
  const expected = {counter: 1, counter2: 2},
        actual   = state(['counter', 'counter2']);
  assert.deepEqual(actual, expected, 'States values correct');
  assert.end();
});

test('Dispatch an action', (assert) => {
  reset();
  const counter = {
    INIT    : createDict(() => 0),
    INCREASE: createDict((payload, state) => state + 1)
  };
  register({counter});
  dispatch('counter:INCREASE');
  const expected = 1,
        actual   = state('counter');
  assert.equal(actual, expected, 'Action dispatched');
  assert.end();
});

test('Dispatch an undefined action', (assert) => {
  reset();
  const counter = {
    INIT    : createDict(() => 0),
    INCREASE: createDict((payload, state) => state + 1)
  };
  register({counter});
  dispatch('counter:DECREASE');
  const expected = 0,
        actual   = state('counter');
  assert.equal(actual, expected, `State doesn't change`);
  assert.end();
});

test('Dispatch multiple actions', (assert) => {
  reset();
  const counter  = {
    INIT    : createDict(() => 0),
    INCREASE: createDict((payload, state) => state + 1)
  };
  const counter2 = {
    INIT    : createDict(() => 0),
    INCREASE: createDict((payload, state) => state + 2)
  };
  register({counter, counter2});
  dispatch(['counter:INCREASE', 'counter2:INCREASE']);
  const expected = {counter: 1, counter2: 2},
        actual   = {counter: state('counter'), counter2: state('counter2')};
  assert.deepEqual(actual, expected, 'Actions dispatched');
  assert.end();
});

test('Dispatch an action that fails without catching the error', (assert) => {
  reset();
  const counter = {
    INIT    : createDict(() => 0),
    INCREASE: createDict((payload, state) => state + 1, ({value}) => value)
  };
  register({counter});
  dispatch('counter:INCREASE');
  setTimeout(() => {
    assert.pass('Error logged but code keeps running');
    assert.end();
  }, 200);
});

test('Dispatch an action with promise', (assert) => {
  reset();
  const user = {SIGN_IN: createDict(getUser)};
  register({user});
  observe('user', (actual) => {
    const expected = {user: {name: 'Thram'}};
    assert.deepEqual(actual, expected, 'Promise resolve correctly');
    assert.end();
  });
  dispatch('user:SIGN_IN');
});

test('Dispatch an action with promise that fails', (assert) => {
  reset();
  clearObservers(['user']);
  const user = {
    SIGN_IN: createDict(getUserError, (payload) => payload && payload.user, (actual) => {
      const expected = {error: 'User not found'};
      assert.deepEqual(actual, expected, 'Promise failed');
      assert.end();
    })
  };
  register({user});
  dispatch('user:SIGN_IN');
});

test('Dispatch an action that fails and catch the error', (assert) => {
  reset();
  const counter = {
    INIT    : createDict(() => 0),
    INCREASE: createDict((payload, state) => state + 1, ({value}) => value, (actual) => {
      const expected = `Cannot read property 'value' of undefined`;
      assert.equal(actual.message, expected, 'Action failed');
      assert.end();
    })
  };
  register({counter});
  dispatch('counter:INCREASE');
});

test('Initialize state manually', (assert) => {
  reset();
  const counter = {
    INIT    : createDict(() => 0),
    INCREASE: createDict((payload, state) => state + 1)
  };
  register({counter});
  dispatch('counter:INCREASE');
  initState('counter');
  const expected = 0,
        actual   = state('counter');
  assert.equal(actual, expected, 'State initialized manually');
  assert.end();
});

test('Initialize manually multiple states', (assert) => {
  reset();
  const counter  = {
    INIT    : createDict(() => 0),
    INCREASE: createDict((payload, state) => state + 1)
  };
  const counter2 = {
    INIT    : createDict(() => 0),
    INCREASE: createDict((payload, state) => state + 2)
  };
  register({counter, counter2});
  dispatch(['counter:INCREASE', 'counter2:INCREASE']);
  initState(['counter', 'counter2']);
  const expected = {counter: 0, counter2: 0},
        actual   = state(['counter', 'counter2']);
  assert.deepEqual(actual, expected, 'Action dispatched');
  assert.end();
});

test('Initialize manually all states', (assert) => {
  reset();
  const counter  = {
    INIT    : createDict(() => 0),
    INCREASE: createDict((payload, state) => state + 1)
  };
  const counter2 = {
    INIT    : createDict(() => 0),
    INCREASE: createDict((payload, state) => state + 2)
  };
  register({counter, counter2});
  dispatch(['counter:INCREASE', 'counter2:INCREASE']);
  initState();
  const expected = {counter: 0, counter2: 0},
        actual   = state(['counter', 'counter2']);
  assert.deepEqual(actual, expected, 'Actions dispatched');
  assert.end();
});

test('Observe state change', (assert) => {
  reset();
  const counter = {
    INIT    : createDict(() => 0),
    INCREASE: createDict((payload, state) => state + 1)
  };
  register({counter});
  observe('counter', (actual) => {
    const expected = 1;
    assert.equal(actual, expected, 'State changed');
    assert.end();
  });
  dispatch('counter:INCREASE');
});

test('Observe should not trigger', (assert) => {
  reset();
  const test  = {INIT: createDict(() => 'test', (val) => val)},
        check = (state) => assert.error();
  register({test});
  observe('test', check);
  removeObserver('test', check);
  dispatch('test:INIT');
  setTimeout(() => {
    assert.pass('Observe not executed');
    assert.end();
  }, 200);
});

test('Clear observers', (assert) => {
  reset();
  const test   = {INIT: createDict(() => 'test')},
        check  = (state) => assert.error(),
        check2 = (state) => assert.error();
  register({test});
  observe('test', check);
  observe('test', check2);
  clearObservers('test');
  dispatch('test:INIT');
  setTimeout(() => {
    assert.pass('Observers not executed');
    assert.end();
  }, 200);
});

test('Clear multiple states observers', (assert) => {
  reset();
  const test   = {INIT: createDict(() => 'test')},
        test2  = {INIT: createDict(() => 'test2')},
        check  = (state) => assert.error(),
        check2 = (state) => assert.error();
  register({test, test2});
  observe('test', check);
  observe('test', check2);
  observe('test2', check);
  observe('test2', check2);
  clearObservers(['test', 'test2']);
  dispatch('test:INIT');
  dispatch('test2:INIT');
  setTimeout(() => {
    assert.pass('Observers not executed');
    assert.end();
  }, 200);
});

test('Add middlewares', (assert) => {
  reset();
  const counter = {
    INIT    : createDict(() => 0),
    INCREASE: createDict((payload, state) => state + 1)
  };
  register({counter});
  let processed = 0;

  const check = (actual) => {
    processed++;
    if (processed === 3) {
      const expected = {action: 'INCREASE', next: 1, payload: undefined, prev: 0, state: 'counter'};
      assert.deepEqual(actual, expected, `${processed} Middlewares correctly processed`);
      assert.end();
    }
  };
  addMiddleware(check);
  addMiddleware([check, check]);
  dispatch('counter:INCREASE');
});