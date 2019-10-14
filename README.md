# Getting started

## Bugs

* [x] Fix issue with removing a when interpolation. See Styles example and press on/off
* [x] Style-flash in Styles example - press button and while it is animating, press inbox-button
* [x] Create central function for removing interpolations and animations
* [x] Fix createAnimationNode impl so that tests only needs to run once
* [ ] Shared transitions (WIP)
    * [ ] Fix running second shared transition while one is running  
    Should we skip providing shared transitions in first version?

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

| Property     | Description                                                    |
| ------------ | -------------------------------------------------------------- |
| style        | Style that will generate automatic interpolations when changed |
| initialStyle | Initial style for component. Will be interpolated on mount     |
| staticStyle  | Style that will not generate interpolations                    |
| config       | Configuration object (see below)                               |
| states       | State / states (see below)                                     |
| animation    | Override default animation                                     |

### Events

| Event            | Description                                       |
| ---------------- | ------------------------------------------------- |
| onPress          | Callback for touches                              |
| onPressIn        | Callback for touch down                           |
| onPressOut       | Callback for touch up                             |
| onAnimationBegin | Called when automatic style interpolation starts  |
| onAnimationEnd   | Called when automatic style interpolation is done |

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

  const config = useFluidConfig({
    when: {
      state: activeState,
      style: styles.active
    }
  });

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

##### Configuration values

| Field          | Description |
| -------------- | ----------- |
| when           |             |
| onEnter        |             |
| onExit         |             |
| animation      |             |
| childAnimation |             |
| interpolation  |             |


###### When

The when configuration field can contain different types of configuration. All when configurations have a common set of properties:

| Field     | Description                           |
| --------- | ------------------------------------- |
| state     | State name or state element reference |
| animation |                                       |
| loop      |                                       |
| flip      |                                       |
| yoyo      |                                       |
| onEnter   |                                       |
| onExit    |                                       |

The simplest when configuration is to tell the component to change style when a state changes. This is similar to changing the component style directly and is set with the style property directly:

```js
when: {
  state: myState,
  style: styles.myStyle
}
```

If you want to control the interpolation more precisly, you can use an interpolation instead of the style field:

```js
when: {
  state: myState,
  interpolation: {
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 1],
    styleKey: "transform.scaleY",
  }
}
```

The interpolation field can contain a single interpolation or an array of interpolations.

(See below for a description of the interpolation element)

###### onEnter

###### onExit

###### Interpolation

###### Child Animation

### Value Interpolations
One of the more advanced techniques when building animations and transitions in React Native is when you need your interpolation to depend on a gesture value or a scrolliew position. In `react-native-fluid-transitions` this is already taken care of for you.

TODO: Define values
TODO: Use values

#### Hooks

useFluidState  
useFluidConfig