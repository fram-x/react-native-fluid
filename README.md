# Getting started

## Bugs

[X] Fix issue with removing a when interpolation. See Styles example and press on/off
[ ] Shared transitions
  [ ] Fix running second shared transition while one is running
      Should we skip providing shared transitions in first version?

### Web
[ ] Fix measure of rotated elements on Web

### Android
[ ] Parallax example, abrubt change of header color
[ ] SVG - ValueNode cannot be cast to a number
[ ] Interpolation 
  [ ] "Error while updating transform"
  [ ] Rotated image is not displayed correctly
[ ] Stagger is really slow
[ ] Interactions - some alignment issue
[ ] Repeat is really slow
 
## TODO

[X] ConfigStateType should be accepted as state 
[X] StaggerMs & StaggerFunc => stagger
[X] Test/implement stagger custom function
[ ] Create dragging example
[ ] Navigation with new Stack navigator

## Later

[ ] Prop animation - support nested props and arrays WIP
[ ] Fix Spotify example, find out why changing to static styles fixes initial pos
[ ] Add velocity calculation to spring functions, find a way to keep velocity on 
    animations and pass them to the spring function
[ ] Optimize runner - find common interpolations and accept multiple set value nodes

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

Getting your first transitions set up is also really easy and should be the same for React Native and React Native Web:

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

### Events
onAnimationBegin
onAnimationDone

### Configuration and States

If you want more control over how animations are played, you can build your own
animation definitions using configuration and state. 

A state is ....

Configuration is....

#### Hooks

useFluidState
useFluidConfig