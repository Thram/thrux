# API

#### Dictionaries

```javascript
import {register} from 'thrux';

const state = {
    reducer: (payload, state)=> console.log('New State', payload), 
    map: (rawValue) => rawValue.data, 
    error: (err)=> console.err('An error happened', err)
};

register({state});
```

#### createDict(reducer, map, error)

Create the dictionary of methods that will be used for each action.

Param | Type | Description
----- | ---- | -----------
reducer | Function | Update the current state. This could return an **Object** or a **Promise** and update the state async.
map | Function | *(optional)* A map function to sanitize the value handle by the reducer.
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

You can define an INIT action with a function that sets the initial value of your state after register

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
key | String [Array of Strings] | *(optional)* State(s) that want to initialize

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
stateAction | String: **'state:ACTION'** [Array of Strings] | String(s) that represents the state(s) and the action(s) that you want to dispatch.
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
stateKey | String [Array of Strings] | *(optional)* String(s) that represents the state(s)

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
stateKey | String | String that represents the state

```javascript
import {clearObservers} from 'thrux';

clearObservers('user');
```

#### addMiddleware(middleware)

Add some middleware function. It won't modified the state.

Param | Type | Description
----- | ---- | -----------
middleware | Function *or* Array of Functions | Function(s) that trigger when the state changes with the following params: {state, action, prev, payload, next}

```javascript
import {addMiddleware} from 'thrux';

// Add logger
addMiddleware(({state, action, prev, payload, next}) => console.log({state, action, prev, payload, next}));
addMiddleware([({prev}) => console.log('prev', prev), ({next}) => console.log('next', next)]);
```