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