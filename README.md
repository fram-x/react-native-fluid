# Documentation

Declarative animations for React Native and React Native Web.

## Installation

Installing react-native-fluid-transitions is simple, both in React Native Web and in React Native.

**React Native Web**

```
yarn add react-native-fluid-animations
yarn add react-native-fluid-transitions
```

**React Native**

```
yarn add react-native-reanimated
yarn add react-native-fluid-animations
yarn add react-native-fluid-transitions
```

> Remember to run `react-native-link` or `cd ios && pod install` (depending on your version of React Native) after installing the dependencies.

## Example

Getting your first transitions set up is really easy:

``` js
import React, {useState} from 'react';
import { StyleSheet } from 'react-native';
import Fluid from 'react-native-fluid-transitions';

const styles = StyleSheet.create({
  active: { width: 100, height: 100, backgroundColor: 'aqua' },
  inactive: { width: 50, height: 50, backgroundColor: 'gold' },
});

const MyComponent = () => {
  const [active, setActive] = useState(false);
  const toggle = () => setActive(a => !a);

  return <Fluid.View 
    style={active ? styles.active : styles.inactive}
    onPress={toggle}
  />
}
```

Try using this component in your view and click the box. The component should automatically interpolate between the two styles with default values that should work for the different style properties.

## API

API reference for the Fluid.* components:

- Fluid.View
- Fluid.Image
- Fluid.Text
- Fluid.ScrollView

### Fluid.*

The `Fluid.*` components are the basic building blocks of react-native-fluid-transitions. They all implement the same properties as their corresponding React Native components.

**Properties**

| Property     | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| style        | Style that will generate automatic interpolations when changed          |
| initialStyle | Initial style for component. Will be interpolated from on mount         |
| staticStyle  | Style that will not generate interpolations (use for optimizing styles) |
| config       | <a name="Configuration">Configuration object                            |
| states       | <a name="States">State / states                                         |
| animation    | <a name="AnimationType">Animation                                       |

**Events**

| Event            | Description                             |
| ---------------- | --------------------------------------- |
| onPress          | Callback when tapped                    |
| onPressIn        | Callback for touch down                 |
| onPressOut       | Callback for touch up                   |
| onAnimationBegin | Called when style interpolation starts  |
| onAnimationEnd   | Called when style interpolation is done |

## Configuration and States

If you want more control over how animations are played, you can build your own animation definitions using the configuration and state and properties of a Fluid Component.

A simple example illustrates how states and configuration can be used to build transitions:

``` js
import React from 'react';
import { StyleSheet } from 'react-native';
import Fluid, { useFluidState, useFluidConfig } from 'react-native-fluid-transitions';

const styles = StyleSheet.create({
  active: { width: 100, height: 100, backgroundColor: 'aqua' },
  inactive: { width: 50, height: 50, backgroundColor: 'gold' },
});

const MyComponent = () => {
  const [activeState, setActiveState] = useFluidState(false);
  const toggle = () => setActiveState(s => !s);

  const config = useFluidConfig(
    WhenState(activeState, style: styles.active)
  );

  return (
    <Fluid.View 
      onPress={toggle}
      config={config}
      states={activeState}
      style={styles.inactive}
    />
  );
}
```
#### <a name="States">States</a>

A fluid state works as a regular React Native state, and can be created with the hook <a href="#useFluidState">`useFluidState`</a>. It returns a state variable and a function for updating the state. This object can be passed along to the Fluid.View through the state property.

```js
const [activeState, setActiveState] = useFluidState(false);
const toggle = () => setActiveState(a => !a);
```

The example shows how to create and update a state with a simple toggle function.

#### <a name="Configuration">Configuration</a>

A configuration object consists of the following types:

| Field          | Description                                                                                                                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| when           | Styles or interpolations that will be used when a given state is active                                                                |
| onEnter        | Interpolation (animation) that will be played when a given state becomes active                                                        |
| onExit         | Interpolation (animation) that will be played when a given state becomes inactive                                                      |
| animation      | Animation definition for all items in configuration                                                                                    |
| childAnimation | Describes how child animations should be ordered                                                                                       |
| interpolation  | Describes interpolations that should be on at all times. Typically used for interpolations that are driven by a ScrollView or gesture. |


#### <a name="When">When</a>

The when configuration field can contain different types of configuration. The when configuration field is created using the `WhenState` function. This function has several different overloads:

**Creates a new when configuration element that applies the provided style when the state is active:**

```js
function WhenState(state, style, options?)
```

**Creates a new when configuration element that applies an interpolation when the state is active:**

```js
function WhenState(state, interpolation, options?)
```

**Creates a new when configuration element that applies an interpolation returned by the factory function when the state is active:**

```js
function WhenState(<a href="#States">state</a>, whenFactory, options?)
```

**<a name="InterpolationType">Interpolation</a>**

An interpolation element consists of the following fields:

| Field             | Description                                               | Type                                   |
| ----------------- | --------------------------------------------------------- | -------------------------------------- |
| styleKey/propName | Name of the property or style that should be interpolated | String                                 |
| inputRange        | Array with input range values                             | number[]                               |
| outputRange       | Array with output range values                            | number[] or string[]                   |
| extrapolate       | Extrapolation                                             | 'clamp', 'extend', 'identity'          |
| extrapolateLeft   | Left extrapolation                                        | 'clamp', 'extend', 'identity'          |
| extrapolateRight  | Right extrapolation                                       | 'clamp', 'extend', 'identity'          |
| animation         | Animation type for interpolation                          | <a href="#AnimationType">AnimationType |

> Note that the styleKey uses dot-notation, so to build an interpolation for the scale transform you would write "transform.scale".

**<a name="Options">Options</a>**

The object element has a set of optional fields that can be set:

| Field   | Description                                            | Type               |
| ------- | ------------------------------------------------------ | ------------------ |
| onBegin | Callback on animation start                            | Function           |
| onEnd   | Callback on animation end                              | Function           |
| loop    | Number of times to loop animation                      | number or Infinity |
| flip    | Number of times to flip animation                      | number or Infinity |
| yoyo    | Number of times to play the animation with yoyo effect | number or Infinity |

**<a name="AnimationType">Animation</a>**

An animation type is a description of the animation function to run a given animation and can be of two types, `spring` or `timing`. An animation type consists of the following fields:

**Timing Animation**

| Field    | Description                                         | Type               |
| -------- | --------------------------------------------------- | ------------------ |
| type     | Type of animation                                   | 'timing'           |
| duration | Duration in number of milliseconds                  | number             |
| delay    | Delay before starting the animation in milliseconds | number (optional)  |
| easing   | Curve to apply to the animation                     | Easing  (optional) |


**Spring Animation**

| Field     | Description                       | Type     |
| --------- | --------------------------------- | -------- |
| type      | Type of animation                 | 'spring' |
| mass      | Mass of the spring animation      | number   |
| stiffness | Stiffness of the spring animation | number   |
| damping   | Damping of the spring animation   | number   |

### onEnter / onExit

If you want an interpolation to run when a state change occurs, you can add `OnEnter` or `OnExit` configuration elements to your Fluid.View. The onEnter / onExit element can be created with the `OnEnterState` / `OnExitState` functions:

**Creates a new onEnter / onExit element describing the interpolation that should be run when the state changes to / from active.**

```js
function (state, interpolation, options?) 
```

Where the parameters <a href="#States">state</a>, <a href="#InterpolationType">interpolation</a> and <a href="#Options">options</a> shares the same types as the `When` element.

This example will add an interpolation that changes the backgroundColor of the View from pink to gold when the myState changes to an active state:

```js
const config = useFluidConfig(
  OnEnterState(myState, {
    styleKey: "backgroundColor",
    inputRange: [0, 1],
    outputRange: ["pink", "gold"],
  }),
);
```

## <a name="Coordination">Child Animation</a>

When animations are played in the context of a parent `Fluid.View`, you can control how these animations should be played by changing the child configuration. There are three different types of child configuration available:

```js
Sequential()
```

```js
Paralell()
```

```js
Staggered(staggerMs? | staggerFunction?, direction)
```

## Value Interpolations
One of the more advanced techniques when building animations and transitions in React Native is when you need your interpolation to depend on a gesture value or a scrolliew position. In `react-native-fluid-transitions` this is already taken care of for you.

Given a view tree that contains a header and a scroll view:

```js
<Fluid.View>
  <Fluid.View config={config} staticStyle={styles.header}/>
  <Fluid.ScrollView label="myScrollView">      
    {children}
  </Fluid.ScrollView>
</Fluid.View>
```

You can add interpolations to the header component's configuration using the scroll position from the scroll view:

```js
const value = InterpolationValue("myScrollView", "scrollY");
const config = useFluidConfig(
  Interpolation(value, {
    inputRange: [0, 10],
    outputRange: [1, 0.99],
    styleKey: "transform.scale",
  });
```

A `Fluid.ScrollView` exposes two values, `scrollY` and `scrollX`.
