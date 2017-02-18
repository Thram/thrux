# ![Thrux](https://raw.githubusercontent.com/Thram/thrux/master/thrux_logo.png)

*`(n.) Something that is the absolute core and driving force behind something.`*

# The Basics: What is state management?

If you are new at programming, or you never bumped into technologies like [Flux](https://facebook.github.io/flux/) or [Redux](http://redux.js.org/), maybe you never heard about the concept of **state management** in front-end applications.

With this architecture you’re encouraged to use unidirectional data flow. This could be simplified in a way that looks like this:
  
  
  
  
![State management](https://raw.githubusercontent.com/Thram/thrux/gh-pages/assets/state_management.png)
 
 
 
 
Let's break this down:

- **View:** Is your presentation layer. Here you will be displaying your data from the ***Store*** and also waiting for any event (Human or not) to trigger an ***Action***. 
- **Action:** Is the behaviour you want to process. These actions will have a related function that will change your current state. 
- **Dispatcher:** Is the function related to the action. This function will generate a new state and pass it to the ***Store***.
- **Store:** Is where you storage the current state of your application.
 
So how does this work? Here I show you an example:
 
 
 
 
![Example flow](https://raw.githubusercontent.com/Thram/thrux/gh-pages/assets/example_flow.png)
 
 
 
 
As you can see, you start with your current ***State***(***0***), then from the ***View*** an ***Action***(***INCERASE***) is triggered, this ***Action*** is processed by the ***Dispatcher*** function (***State + 1***) and returns a ***New State*** that gets set on the ***Store*** changing the current ***State***(***1***) and the ***View*** shows the new ***State***.
 
So in summary:
 
 1) The ***View*** shows the current ***State*** from the ***Store*** and waits for an ***Action*** to get triggered.
 2) The ***Action*** triggers
 3) The ***Dispatcher*** process the ***Action*** and return a ***New State***
 4) The ***Store*** sets the ***New State*** as the current ***State***
 
 And Repeat...
 
 At that's it, a simple explanation of State Management. Depending on what tool you use this architecture can mutate a little bit, but this is the simplest way to look at it to understand how all this tools works.
 
 # So why use Thrux?
 
 I've been working with this architecture for long time, I used to apply this concept on my apps using my own implementations. When Redux came out it was a relief, but after using it in several projects I found that at some point, if my app scales, my Redux files (actions/reducers/store) start to get messy and a bit annoying to handle. I also found my self writing a lot of boilerplate code every time I defined a new action, so inspired by the basic concepts that I just explained, I decided to create this library where I've simplified that workflow and aim to have a better and easier file structure.
 
 Let me show you how simple the above example could look using Thrux:
 
 
 
 
 ![Example flow](https://raw.githubusercontent.com/Thram/thrux/gh-pages/assets/example_flow.png)




```javascript
import {register,createDict, dispatch, observe, state} from "thrux";

register({
  counter:{
    INIT    : createDict(()=> 0),
    INCREASE: createDict((payload, state)=> state + 1)
  }
});

console.log(state('counter')); // State = 0

// Async State check
observe('counter', (state)=> console.log(state)); // State = 1

dispatch('counter:INCREASE');

// Sync State check
console.log(state('counter')); // State = 1

```