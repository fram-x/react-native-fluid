# Getting started

## Bugs

* [x] Fix issue with removing a when interpolation. See Styles example and press on/off
* [x] Style-flash in Styles example - press button and while it is animating, press inbox-button
* [x] Create central function for removing interpolations and animations
* [x] Fix createAnimationNode impl so that tests only needs to run once
* [ ] Shared transitions (WIP)
    * [ ] Fix running second shared transition while one is running  
    Should we skip providing shared transitions in first version?
* [ ] Fix issue with when.interpolation.value not using animation (is it possible?)

### Web

* [ ] Fix measure of rotated elements on Web
* [ ] Styles example: Button is not moving

### Android

* [ ] Parallax example, not interpolating change of header color correctly
* [x] SVG - ValueNode cannot be cast to a number
* [x] Interpolation
    * [x] "Error while updating transform"
    * [x] Rotated image is not displayed correctly
* [x] Interactions - some alignment issue

## TODO

* [x] ConfigStateType should be accepted as state
* [x] StaggerMs & StaggerFunc => stagger
* [x] Test/implement stagger custom function
* [x] Create dragging example
* [ ] Navigation with new Stack navigator

## Later

* [ ] Prop animation - support nested props and arrays WIP
* [ ] Fix Spotify example, find out why changing to static styles fixes initial pos
* [ ] Add velocity calculation to spring functions, find a way to keep velocity on  
animations and pass them to the spring function
* [ ] Optimize running multiple animation updates when nodes are equal (duration, offset, easing)

# Documentation

## Getting Started

Installing react-native-fluid-transitions is simple, both in React Native Web and in React Native.

### React Native Web

```
yarn add react-native-fluid-animations
yarn add react-native-fluid-transitions
```

### React Native

```
yarn add react-native-reanimated
yarn add react-native-fluid-animations
yarn add react-native-fluid-transitions
```

Getting your first transitions set up is really easy:

``` js
import React from 'react';
import { StyleSheet } from 'react-native';
import Fluid from 'react-native-fluid-transitions';

const styles = StyleSheet.create({
  active: { width: 100, height: 100, backgroundColor: 'aqua' },
  inactive: { width: 50, height: 50, backgroundColor: 'gold' },
});

const MyComponent = ({active}) => (
  <Fluid.View style={active ? styles.active : styles.inactive}/>
)
```

Try using this component in your view and toggle the active property.  
The component should automatically interpolate between the two styles with  
default values that should work for the different style properties.

## Api

### Properties

| Property     | Description                                                             |
| ------------ | ----------------------------------------------------------------------- |
| style        | Style that will generate automatic interpolations when changed          |
| initialStyle | Initial style for component. Will be interpolated from on mount         |
| staticStyle  | Style that will not generate interpolations (use for optimizing styles) |
| config       | Configuration object (see below)                                        |
| states       | State / states (see below)                                              |
| animation    | Override default animation                                              |

### Events

| Event            | Description                             |
| ---------------- | --------------------------------------- |
| onPress          | Callback when tapped                    |
| onPressIn        | Callback for touch down                 |
| onPressOut       | Callback for touch up                   |
| onAnimationBegin | Called when style interpolation starts  |
| onAnimationEnd   | Called when style interpolation is done |

### Configuration and States

If you want more control over how animations are played, you can build your own  
animation definitions using the configuration and state and properties of a Fluid Component.

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
#### States 

#### Configuration

A configuration object consists of the following types:

| Field          | Description                                                                                                                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| when           | Styles or interpolations that will be used when a given state is active                                                                |
| onEnter        | Interpolation (animation) that will be played when a given state becomes active                                                        |
| onExit         | Interpolation (animation) that will be played when a given state becomes inactive                                                      |
| animation      | Animation definition for all items in configuration                                                                                    |
| childAnimation | Describes how child animations should be ordered                                                                                       |
| interpolation  | Describes interpolations that should be on at all times. Typically used for interpolations that are driven by a ScrollView or gesture. |


##### When

The when configuration field can contain different types of configuration. The when configuration field is created using the `WhenState` function. This function has several different overloads:

**Creates a when configuration that applies the provided style when the state is active:**

`function WhenState(state, style, options?)`

**Creates a when configuration that applies an interpolation when the state is active:**

`function WhenState(state, interpolation, options?)`

**Creates a when configuration that applies an interpolation returned by the factory function when the state is active:**

`function WhenState(state, whenFactory, options?)`

###### <a name="InterpolationType"></>Interpolation

An interpolation element consists of the following fields:

| Field             | Description                                               | Type                                      |
| ----------------- | --------------------------------------------------------- | ----------------------------------------- |
| styleKey/propName | Name of the property or style that should be interpolated | String                                    |
| inputRange        | Array with input range values                             | number[]                                  |
| outputRange       | Array with output range values                            | number[] or string[]                      |
| extrapolate       | Extrapolation                                             | 'clamp', 'extend', 'identity'             |
| extrapolateLeft   | Left extrapolation                                        | 'clamp', 'extend', 'identity'             |
| extrapolateRight  | Right extrapolation                                       | 'clamp', 'extend', 'identity'             |
| animation         | Animation type for interpolation                          | <a href="#AnimationType">AnimationType</> |

> Note that the styleKey uses dot-notation, so to build an interpolation for the scale transform you would write "transform.scale".

###### Options

The object element has a set of optional fields that can be set:

| Field   | Description                                            | Type               |
| ------- | ------------------------------------------------------ | ------------------ |
| onBegin | Callback on animation start                            | Function           |
| onEnd   | Callback on animation end                              | Function           |
| loop    | Number of times to loop animation                      | number or Infinity |
| flip    | Number of times to flip animation                      | number or Infinity |
| yoyo    | Number of times to play the animation with yoyo effect | number or Infinity |

###### <a name="AnimationType"></>Animation

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

##### onEnter

##### onExit

##### Interpolation

##### Child Animation

### Value Interpolations
One of the more advanced techniques when building animations and transitions in React Native is when you need your interpolation to depend on a gesture value or a scrolliew position. In `react-native-fluid-transitions` this is already taken care of for you.

TODO: Define values
TODO: Use values

#### Hooks

useFluidState  
useFluidConfig