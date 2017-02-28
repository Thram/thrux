# ![Thrux](https://raw.githubusercontent.com/Thram/thrux/master/thrux_logo.png)

*`(n.) Something that is the absolute core and driving force behind something.`*

# The Basics: What is state management?

If you are new at programming, or you never bumped into technologies like [Flux](https://facebook.github.io/flux/) or [Redux](http://redux.js.org/), maybe you never heard about the **Flux** pattern. This pattern encourages you to use unidirectional data flow, different to the classical MVC (Model-View-Controller) pattern that is very common to have bidirectional flow.
 
### MVC Problems
MVC is a legendary pattern that has been used for various projects since 1976 (it was introduced in Smalltalk-76). It has stood the test of time and most of the biggest projects still use it today. Why even try to replace it?
 
The main problem is the bidirectional communication, where one change can loop back and have cascading effects across the codebase (making things very complicated to debug and understand).
 
In general the flow inside the MVC pattern is not well defined. A lot of the bigger implementations do it very differently.

How does the Flux pattern solve this? By forcing an unidirectional flow of data between a system’s components. Is all about controlling the flow inside the app, and making it as simple to understand as possible. Using ***Stores*** that contain the application’s state and logic. The best abstraction is to think of stores as managing a particular domain of the application. They aren’t the same as models in MVC since models usually try to model single objects, while stores in Flux can store anything

Every change goes through the dispatcher. A store can’t change other stores directly. Same applies for views and other actions. Changes must go through the dispatcher via actions.

### The State Manager pattern

What I call the **State Manager pattern** is a simplified version of the Flux pattern. Instead of having multiple stores like Flux, this pattern has one single Store that manage multiple state objects, so you can check for particular state changes inside the store. This could be represented in a way that looks like this:  
  
![State management](https://raw.githubusercontent.com/Thram/thrux/gh-pages/assets/state_management.png)
 
Let's break this down:

- **View:** Is your presentation layer. Here you will be displaying your data from the ***Store*** and also waiting for any event (Human or not) to trigger an ***Action***. 
- **Action:** Is the behaviour you want to process. These actions will have a related function that will change your current state. 
- **Dispatcher:** Is the function related to the action. This function will generate a new state and pass it to the ***Store***.
- **Store:** Is where you storage the current states of your application.
 
So how does this work? Here I show you an example:
 
![Example flow](https://raw.githubusercontent.com/Thram/thrux/gh-pages/assets/example_flow.png)
 
As you can see, you start with your current ***Counter's State***(***0***), then from the ***View*** an ***Action***(***counter:INCERASE***) is triggered, this ***Action*** is processed by the ***Dispatcher*** function (***Counter + 1***) and returns a ***New State*** that gets set on the ***Store*** changing the current ***Counter's State***(***1***) and the ***View*** shows the new ***Counter's State***.
 
So in summary:
 
 1. The ***View*** shows the current ***Counter's State*** from the ***Store*** and waits for an ***Action*** to get triggered.
 2. The ***Action*** triggers
 3. The ***Dispatcher*** process the ***Action*** and return a ***New State***
 4. The ***Store*** sets the ***New State*** as the current ***Counter's State***
 
And Repeat...

And that's it, a simple explanation of State Management. Depending on what tool you use this pattern can mutate a little bit, but this is the simplest way to look at it to understand how all this tools works.

# So why use Thrux?

I've been working with this pattern for long time, I used to apply this concept on my apps using my own implementations. When Redux came out it was a relief, but after using it in several projects I found that at some point, if my app scales, my Redux files (actions/reducers/store) start to get messy and a bit annoying to handle. I also found my self writing a lot of boilerplate code every time I defined a new action, so inspired by the basic concepts that I just explained, I decided to create this library where I've simplified that workflow and aim to have a better and easier file structure.

Let me show you how simple the above example could look using Thrux:
 
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