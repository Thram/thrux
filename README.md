# ![Thrux](https://raw.githubusercontent.com/Thram/thrux/master/thrux_logo_sm.png)
*`(n.) Something that is the absolute core and driving force behind something.`*

[![Travis build](https://img.shields.io/travis/Thram/thrux.svg?style=flat-square)](https://travis-ci.org/Thram/thrux)
[![Codecov coverage](https://img.shields.io/codecov/c/gh/Thram/thrux.svg?style=flat-square)](https://codecov.io/gh/Thram/thrux)
[![version](https://img.shields.io/npm/v/thrux.svg?style=flat-square)](https://www.npmjs.com/package/thrux)
[![downloads](https://img.shields.io/npm/dt/thrux.svg?style=flat-square)](https://www.npmjs.com/package/thrux)
[![MIT License](https://img.shields.io/npm/l/thrux.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Simple state management inspired on Redux.

**Motivation:** *I've been using Redux in several projects recently and don't get me wrong, I love it, but I've found that at some point, if my app scales, my Redux files (actions/reducers/store) start to get messy and a bit annoying to handle. So inspired by the basic concepts of Redux, I decided to create this library where I've simplified that workflow and aim to have a better and easier file structure. 
I hope you like it and any feedback or collaboration is more than welcome.*

## Install

```npm install thrux --save``` 

or with yarn

```yarn add thrux```

## API

#### createDict(reducer, map, error)

Create the dictionary of methods that will be used for each action.

Param | Type | Description
----- | ---- | -----------
reducer | Function | Update the current state. This could return an **Object** or a **Promise** and update the state async.
map | Function | *(optional)* Map the value handle by the reducer.
error | Function | *(optional)* Error handler.

```javascript
import {createDict} from 'thrux';

const counter = {
  INCREASE: createDict((payload, state) => state + 1),
  DECREASE: createDict((payload, state) => state - 1)
}

const user = {
  SIGN_IN: createDict(({username, pass}) => fetch('./sign_in_url', {username, pass}), (user) => {username: user.name, pass: user.password})
}
```

##### *Initialization*

You can define a INIT dictionary with a function that sets the initial value of your state after register

```javascript
import {createDict} from 'thrux';

const counter = {
  INIT    : createDict(() => 1),
  INCREASE: createDict((payload, state) => state + 1),
  DECREASE: createDict((payload, state) => state - 1)
}
``` 

#### initState(key)

Triggers `INIT` action (a.k.a. initialize the state manually)  

Param | Type | Description
----- | ---- | -----------
key | String *or* [Array of Strings] | *(optional)* State(s) that want to initialize

```javascript
import {initState} from 'thrux';

initState('counter');
initState(['counter', 'user']);
```

#### register(dictionaries)

Register your dictionaries.

Param | Type | Description
----- | ---- | -----------
dictionaries | Object | List of states and their respective dictionaries

```javascript
import {register} from 'thrux';

register({counter, user});
```

#### dispatch(stateAction, data)

Dispatch the action that will update your state.

Param | Type | Description
----- | ---- | -----------
stateAction | String *or* [Array of Strings] | String(s) that represents the state(s) and the action(s) that you want to dispatch: **'state:ACTION'**
data | Any | *(optional)* Whatever data your reducer is prepared to handle

```javascript
import {dispatch} from 'thrux';

dispatch('counter:INCREASE');

dispatch(['counter:INCREASE', 'counter2:INCREASE']);

dispatch('user:SIGN_IN', {user:'Thram', pass:'password'});
```

#### state(stateKey)

***returns:*** [Object]

Retrieve the state value.

Param | Type | Description
----- | ---- | -----------
stateKey | String *or* [Array of Strings] | *(optional)* String(s) that represents the state(s)

```javascript
import {state} from 'thrux';

const allStates = state();

const someStates = state(['counter','user']);

const userStates = state('user');
```

#### observe(stateKey, listener)

Observe when the state changed.

Param | Type | Description
----- | ---- | -----------
stateKey | String | String that represents the state
listener | Function | Function that gets trigger when the state changes

```javascript
import {observe} from 'thrux';

observe('user', (state, actionKey)=> console.log(actionKey, state.profile));
```

#### removeObserver(stateKey, listener)

Remove an observe listener.

Param | Type | Description
----- | ---- | -----------
stateKey | String | String that represents the state
listener | Function | Function that gets trigger when the state changes

```javascript
import {observe, removeObserver} from 'thrux';

const logProfile = (auth) => console.log(auth.profile);

observe('user', logProfile);

removeObserver('user', logProfile); // logProfile won't trigger
```

#### clearObservers(stateKey)

Remove all observe listeners.

Param | Type | Description
----- | ---- | -----------
stateKey | String *or* [Array of Strings] | String that represents the state

```javascript
import {clearObservers} from 'thrux';

clearObservers('user');
clearObservers(['counter1', 'counter2']);
```

#### addMiddleware(middleware)

Add some middleware function. It won't modified the state.

Param | Type | Description
----- | ---- | -----------
middleware | Function *or* [Array of Functions] | Function(s) that trigger when the state changes with the following params: {state, action, prev, payload, next}

```javascript
import {addMiddleware} from 'thrux';

// Add logger
addMiddleware(({state, action, prev, payload, next}) => console.log({state, action, prev, payload, next}));
addMiddleware([({prev}) => console.log('prev', prev), ({next}) => console.log('next', next)]);
```

#### reset()

Reset Thrux store.

```javascript
import {reset} from 'thrux';

reset();
```

## Examples

- [Counter](https://github.com/Thram/thrux/blob/master/examples/counter.js)
- [Todo](https://github.com/Thram/thrux/blob/master/examples/todo.js)


## Thanks!