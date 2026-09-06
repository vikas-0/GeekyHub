---
title: "Handling multiple stores in a React-Redux application"
date: 2021-10-12T00:27:00+05:30
tags: ['React', 'Javascript', 'Redux']
description: Using multiple stores in a React application can get pretty complex.
author: "Vikas Kumar"
ShowToc: false
TocOpen: false
draft: false
cover:
    image: "multiple-redux-stores"
    relative: true
    alt: "Multiple stores"
    hidden: false
---

In a React-Redux application, it is good practice to have only one Redux store. But if, for some unusual or special reason, you need more than one store, you will face some problems.

The most common problem is that if we wrap a component with a provider and then wrap a child component with another provider, it's not easy to subscribe to the top-level provider's store.

````react
const Component1 = () => {
  return (
    <Provider store={store1}>
      <Provider store={store2}>
        <Component2 />
      </Provider>
    </Provider>
  );
};
````

This can become so confusing that, within a few development iterations, you'll find yourself using providers on every component. Not being able to read values from both stores in a single component will also become frustrating.

To manage this elegantly, we can add some setup that will make things easier.

For this, we will need `react-redux` 7 or later because older versions don't use React's Context API. We will use contexts to access multiple stores without repeatedly wrapping components in providers.

Create a context for each store. You can also import `ReactReduxContext` from `react-redux` and use it for the store you want to make the default.

````react
const store1Context = React.createContext();
const store2Context = React.createContext();
````

Now wrap the root component of the React application with a provider for each store, passing the contexts as props.

````react
<Provider store={store1} context={store1Context}>
  <Provider store={store2} context={store2Context}>
    <App/>
  </Provider>
</Provider>
````

We also need to create custom dispatch and selector hooks. If you use the default hooks (`useSelector`, `useDispatch`), it will use the store with default context, if any.

````react
export const useStore1Dispatch = createDispatchHook(store1Context);
export const useStore1Selector = createSelectorHook(store1Context);

export const useStore2Dispatch = createDispatchHook(store2Context);
export const useStore2Selector = createSelectorHook(store2Context);
````

From this point on, you can use these custom selector and dispatch hooks to access the preferred store from any component in the application.

If you prefer to use the `connect` HOC, you can do the following:
````react
connect(mapStateToProps, mapDispatchtoProps,mergeProps, {context: store1Context})(Component) 
````

Let me know if you have any suggestions or questions. Thanks!
