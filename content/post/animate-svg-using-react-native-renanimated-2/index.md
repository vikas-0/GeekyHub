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

Here, by animating SVG, I mean to change the property of SVG elements dynamically, which will look live-like.

In react native, we can generate/render an SVG using the [react-native-svg](https://github.com/react-native-svg/react-native-svg) library. A complex SVG comprises many more minor elements that could be animated individually. But here, for example, we will take only one piece, a circle.

The following code will draw a circle with a radius of 50 units.

```react
<Svg width={200} height={200}>
  <Circle cx="55" cy="55" r="50" stroke="black" strokeWidth={5} />
</Svg>
```
Suppose we want to animate it to become large and small.
To achieve this, I will use [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/). To learn more about it, you can check out its documentation.

Logically, I am trying to increase or decrease the radius.

Since the radius value is a prop, I will use `useAnimatedProps`. But, first of all, convert Circle to an animated component.

```react
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
```

Now, I can re-write component as

```react
<Svg width={200} height={200}>
  <AnimatedCircle cx="55" cy="55" r="50" stroke="black" strokeWidth={5} />
</Svg>
```

Next step is to store the stroke width and radius. width can be stored in a simple constat, but for the radius we will use [`useSharedValue`](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/shared-values), so that it can be used by woklet to animate.

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
Here, I need some event or action to trigger the radius change. I'll use a button press. (withSpring is default provided animation which is not necessary to use but this looks cool 🤞)

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
You'll notice that even after pressing the button, nothing happens. It is because change of sharedValue doesn't trigger re-render of the react component. finally animated props comes into the picture. Instead of passing prop directly, we will pass it using animated prop.

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

Result, is something like this.
{{< figure src="circle-animation.gif" title="" width="300px">}}

This is a relatively simple example, but I hope I successfully demonstrated the possibilities.
Here the [link](https://gist.github.com/vikas-0/24c785c2a178a790b3b7352b400cc400) of complete code of the result if you are interested.