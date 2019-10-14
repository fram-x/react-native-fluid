# Getting started

## Bugs

- [X] Fix issue with removing a when interpolation. See Styles example and press on/off
- [X] Style-flash in Styles example - press button and while it is animating, press inbox-button
- [X] Create central function for removing interpolations and animations
- [X] Fix createAnimationNode impl so that tests only needs to run once

- [ ] Shared transitions (WIP)
  - [ ] Fix running second shared transition while one is running
      Should we skip providing shared transitions in first version?

### Web
- [ ] Fix measure of rotated elements on Web
- [ ] Styles example: Button is not moving

### Android
- [ ] Parallax example, not interpolating change of header color correctly
- [X] SVG - ValueNode cannot be cast to a number
- [X] Interpolation 
  - [X] "Error while updating transform"
  - [X] Rotated image is not displayed correctly
- [X] Interactions - some alignment issue
 
## TODO

- [X] ConfigStateType should be accepted as state 
- [X] StaggerMs & StaggerFunc => stagger
- [X] Test/implement stagger custom function
- [X] Create dragging example
- [ ] Navigation with new Stack navigator

## Later

- [ ] Prop animation - support nested props and arrays WIP
- [ ] Fix Spotify example, find out why changing to static styles fixes initial pos
- [ ] Add velocity calculation to spring functions, find a way to keep velocity on 
    animations and pass them to the spring function
- [ ] Optimize running multiple animation updates when nodes are equal (duration, offset, easing)

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

```js
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

style
initialStyle
statisStyle
animation
config
states
onPress

### Events
onAnimationBegin
onAnimationDone

### Configuration and States

If you want more control over how animations are played, you can build your own
animation definitions using the configuration and state and properties of a Fluid Component.

A simple example illustrates how states and configuration can be used to build transitions:

```js
import React from 'react';
import { StyleSheet } from 'react-native';
import Fluid, { useFluidState, useFluidConfig } from 'react-native-fluid-transitions';

const styles = StyleSheet.create({
  active: { width: 100, height: 100, backgroundColor: 'aqua' },
  inactive: { width: 50, height: 50, backgroundColor: 'gold' },
});

const MyComponent = () => (
  const [activeState, setActiveState] = useFluidState(false);
  const toggle = () => setActiveState(s => !s);

  const config = useFluidConfig({
    when: {
      state: activeState,
      style: styles.active
    }
  });

  <Fluid.View 
    onPress={toggle}
    config={config}
    states={activeState}
    style={styles.inactive}
  />  
)
```


#### Hooks

useFluidState
useFluidConfig