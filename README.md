# Getting started

## Bugs

[X] Fix issue with removing a when interpolation. See Styles example and press on/off
[ ] Shared transitions
  [ ] Fix running second shared transition while one is running
[ ] Fix measure of rotated elements on Web
[ ] Test examples on Android and fix issues found (list them below)

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

## Getting Started

### Web:
´´´
cd ./src/packages/animated
npm link
´´´

´´´
cd ./src/web
npm link react-native-fluid-animations
´´´

´´´
cd ./src/packages/transitions
npm link
´´´

´´´
cd ./src/web
npm link react-native-fluid-transitions
´´´
