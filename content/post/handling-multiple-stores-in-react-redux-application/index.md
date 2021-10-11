---
title: "Handling multiple stores in a React-Redux application"
date: 2021-10-12T00:27:00+05:30
tags: ['React', 'Javascript', 'Redux']
description: Using multiple store in a react application can get pretty complex.
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

In a react-redux application, it is a good practice to have only one redux store. But if for some weird/"special" reason if you have to have more than one store, you will face some problems. 

The most common problem is that if we wrap a component with a provider and then wrap a child component with another provider, it's not easy to subscribe to the store of top-level provider. 

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

It's so confusing that within a few iterations of development, you'll find yourself using providers on each component, and not being able to read values from both the stores in a single component will frustrate you.

To manage this elegantly, we can do some setup which will ease the things.

For this, we will need `react-redux 7` or greater. Because versions older than it doesn't use react's context API. And we will be using contexts to access multiple stores without wrapping with the providers again and again.

Create a context for each store. You can also import `ReactReduxContext` from `react-redux` and use it for one of the stores, which you want to make default.

````react
const store1Context = React.createContext();
const store2Context = React.createContext();
````

Now wrap the root component of the react application with a provider for each store, passing the contexts as props.

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

From further development, you can use these custom selector and dispatch hooks to use the preferred store in any of the components throughout the application.

If you prefer to connect HOC, then you can do 
````react
connect(mapStateToProps, mapDispatchtoProps,mergeProps, {context: store1Context})(Component) 
````

Let me know if you have any suggestions or questions. Thanks

