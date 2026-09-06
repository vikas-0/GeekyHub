---
title: "Difference between 'useEffect' and calling a function directly inside a component"
date: 2021-05-09T18:02:00+05:30
tags: ['React', 'Javascript']
description: Finding out the difference between 'useEffect' without dependency array and executing function directly.
author: "Vikas Kumar"
ShowToc: false
TocOpen: false
draft: false
cover:
    image: "useeffect.png"
    relative: true
    alt: "useEffect vs direct Function Call"
    hidden: true
---

In React, the `useEffect` hook is pretty straightforward. But its simplicity sometimes makes me forget its actual function. I thought of `useEffect` simply as something that takes a callback and a dependency array as arguments and executes the callback whenever the dependency array changes. Without a dependency array, it runs the callback each time the component renders.

But then, what is the difference between the following two cases?
{{< figure src="useeffect.svg" alt="useEffect vs function call" >}}

To find out, I created a small React application with two numeric props, two numeric state values, and four buttons to increment those numbers.

> ````App.js````
````js {linenos=table}
import { useState } from 'react';
import TestComponent from './TestComponent'

function App() {

  const [prop1, setProp1] = useState(0);
  const [prop2, setProp2] = useState(0);

  return (
    <div>
      <button onClick={()=>setProp1(prev=> prev+1)}>Prop 1</button>
      <button onClick={()=>setProp2(prev=> prev+1)}>Prop 2</button>
      <TestComponent prop1={prop1} prop2={prop2}/>
    </div>
  );
}

export default App;
````

> ````TestComponent.js````
````js {linenos=table}
import { useEffect, useState } from 'react';

function TestComponent({prop1, prop2}) {
    const [state1, setState1] = useState(0);
    const [state2, setState2] = useState(0);

    useEffect(()=>{
        console.log('rendered - useEffect', state1, state2, prop1, prop2);
    });

    const someImportantWork = ()=>{
        console.log('rendered - functionCall', state1, state2, prop1, prop2);
    }
    someImportantWork();

    return (
      <div>
        <button onClick={()=>setState1(prev=> prev+1)}>State 1</button>
        <button onClick={()=>setState2(prev=> prev+1)}>State 2</button>
        <p>Prop 1: {prop1}</p>
        <p>Prop 2: {prop2}</p>
        <p>State 1: {state1}</p>
        <p>State 2: {state2}</p>
      </div>
    );
  }
  
  export default TestComponent;
````

We can see below that both `console.log` statements run whenever we update a state value or prop.

{{< video src="withoutdelay" loop="true">}}

But I think we are missing something because both seem to behave the same way. So let's slow down the rendering.

To slow down the rendering, I added a very long loop inside `return`.

````js {linenos=table}
import { useEffect, useState } from 'react';

const x = new Array(10999999);

function TestComponent({prop1, prop2}) {
````
````js {linenos=table, linenostart=18}
    return (
      <div>
        <button onClick={()=>setState1(prev=> prev+1)}>State 1</button>
        <button onClick={()=>setState2(prev=> prev+1)}>State 2</button>
        {x.map(i=> null)}
        <p>Prop 1: {prop1}</p>
````

After adding the delay, we can clearly see that the expression inside `useEffect` is always executed after the expression in the function.

{{< video src="withdelay" loop="true">}}

This is because the definition of `useEffect` stated at the beginning of this post is incomplete. `useEffect` not only executes the callback on each render (depending on the dependency array), but also ensures that rendering has been completed. That's why `useEffect`'s `console.log` is delayed.


This should not be a problem if you are doing a small calculation or, as in this example, logging. But if you are using a `ref` to access an element, you must ensure that the render has completed; otherwise, you may get the wrong reference.
