---
title: "Difference between 'useEffect' and calling function directly inside a component."
date: 2021-05-09T18:02:00+05:30
tags: ['React', 'Javascript']
description: Finding out the difference between 'useEffect' without dependency array and executing function directly.
author: "Vikas Kumar"
ShowToc: false
TocOpen: false
draft: false
cover:
    image: "useeffect.svg"
    relative: true
    alt: "useEffect vs direct Function Call"
    hidden: true
disqus_identifier: Difference-between-useEffect-and-calling-function-directly-inside-a-component
disqus_url: https://www.geekyhub.in/post/2021/difference-between-useeffect-and-direct-function-call/
---

In React, the useEffect hook is pretty straightforward. But its simplicity sometimes makes me forget its actual function. I remembered useEffect simply as something which takes a callback and a dependency array as arguments, and it will execute the callback whenever the dependency array is changed. And in case of no dependency array, it will run the callback each time the component renders.

But then what will be the difference between the following two cases.
{{< figure src="useeffect.svg" alt="useEffect vs function call" >}}

To find out, I have created a small React application with a couple of props and states of type number and four buttons to increment those numbers.

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

We can see in following that both `console.log` statement runs whenever we update `state` or `prop`.

{{< video src="withoutdelay" loop="true">}}

But I think we are missing something because both seems to be same. So let's slow down the rendering. 

To slow down the rendering I added a very long loopin inside `return`.

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

After the delay we can clearly see that expression inside useEffect is always excuted after expression in the fucntion.

{{< video src="withdelay" loop="true">}}

It is because the definition of `useEffect` stated at the beginning of this post is incomplete. useEffect not only executes the callback on each render (depending upon the dependency array) but also ensures that rendering has been completed. That's why useEffect's `console.log` is delayed. 


This should not be a problem if you are doing some small calculation or, as in this example, logging. But if you are using `ref` to access the element, you must ensure that render has happened; else, you may get the wrong reference. 