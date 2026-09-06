---
title: "Animate SVG in React Native"
date: 2022-02-05T11:00:00+05:30
tags: ['React Native', 'Tutorials', 'Javascript']
description: Animating SVG in React-Native using react-native-reanimated.
author: "Vikas Kumar"
ShowToc: false
TocOpen: false
draft: false
cover:
    image: "user-working.jpg"
    relative: true
    alt: "Animation in React Native"
---

Here, by animating an SVG, I mean changing the properties of SVG elements dynamically to make them appear alive.

In React Native, we can generate or render an SVG using the [react-native-svg](https://github.com/react-native-svg/react-native-svg) library. A complex SVG comprises many smaller elements that can be animated individually. For this example, however, we will use only one element: a circle.

The following code will draw a circle with a radius of 50 units.

```react
<Svg width={200} height={200}>
  <Circle cx="55" cy="55" r="50" stroke="black" strokeWidth={5} />
</Svg>
```
Suppose we want to animate it so that it grows and shrinks.
To achieve this, I will use [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/). To learn more about it, you can check out its documentation.

Logically, I am trying to increase or decrease the radius.

Since the radius value is a prop, I will use `useAnimatedProps`. First, convert `Circle` to an animated component.

```react
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
```

Now I can rewrite the component as follows:

```react
<Svg width={200} height={200}>
  <AnimatedCircle cx="55" cy="55" r="50" stroke="black" strokeWidth={5} />
</Svg>
```

The next step is to store the stroke width and radius. The width can be stored in a simple constant, but for the radius we will use [`useSharedValue`](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/shared-values) so that a worklet can animate it.

```react
export default ()=>{
  const radius = useSharedValue(50);
  const strokeWidth = 5;

  return (
    <Svg width={200} height={200}>
      <AnimatedCircle
        cx={`${radius.value + strokeWidth}`}
        cy={`${radius.value + strokeWidth}`}
        r={`${radius.value}`}
        stroke="black"
        strokeWidth={strokeWidth}
      />
    </Svg>
  )
}
```
Here, I need an event or action to trigger the radius change. I'll use a button press. (`withSpring` is a provided animation that isn't required, but it looks cool 🤞.)

```react
<Button mode="contained" onPress={() => {
  if(radius.value < 80) {
  radius.value = withSpring(80)
  }else{
    radius.value = withSpring(50)
  }
}}>
  Press
</Button>
```
You'll notice that even after pressing the button, nothing happens. This is because changing a shared value doesn't trigger a re-render of the React component. Finally, animated props come into the picture. Instead of passing the props directly, we will pass them using `animatedProps`.

```react
const animatedProps = useAnimatedProps(() => ({
  cx: `${radius.value + strokeWidth}`,
  cy: `${radius.value + strokeWidth}`,
  r:`${radius.value}`
}));
```

```react
<Svg width={200} height={200}>
  <AnimatedCircle
    animatedProps={animatedProps}
    stroke="black"
    strokeWidth={strokeWidth}
  />
</Svg>
```

The result looks something like this:
{{< figure src="circle-animation.gif" title="" width="300px">}}

This is a relatively simple example, but I hope I successfully demonstrated the possibilities.
If you are interested, here is the [complete code](https://gist.github.com/vikas-0/24c785c2a178a790b3b7352b400cc400) for the result.
