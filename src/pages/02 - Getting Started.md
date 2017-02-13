# Gettings Started

## Install

`npm install thrux --save` 


or with yarn


`yarn add thrux`

## Basic Setup

### Dictionaries

1) Define your ***ACTIONS***, each action has a ***Dictionary*** object that you can create manually or using the method **createDict**.

```javascript
const state = {
  ACTION:{
    reducer: (payload, state)=> payload, 
    map: (rawValue) => rawValue.foo, 
    error: (err)=> console.err('An error happened', err)
  },
  ACTION_2:createDict(
    (payload, state)=> state + payload,
    (rawValue) => rawValue.bar,
    (err)=> console.err('An error happened', err)
    )
};
```

### Register

2) Register your state. *You can register states at any time in your app.*  

```javascript
register({state});

```

### Observer

3a) You can observe the state for changes. 

```javascript
observe('state', (newState)=> console.log('State Change', newState));
```

### Dispatch

3b) Dispatch your actions to change the state.

```javascript
dispatch('state:ACTION', {foo:1}); // State = 1
dispatch('state:ACTION_2', {bar:2}); // State = 3
dispatch('state:ACTION'); // Error (State = 3, it doesn't change)
```
