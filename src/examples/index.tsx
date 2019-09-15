import React, {useState, useCallback} from 'react';
import {Image, View, StyleSheet} from 'react-native';
import Fluid, {Easings} from 'react-native-fluid-transitions';
import {createStackNavigator, createAppContainer} from 'react-navigation';

import HomeScreen from './HomeScreen';
import StylesExampleScreen from './Styles';
import TextExampleScreen from './Text';
import AppStoreExampleScreen from './AppStore';
import ListExampleScreen from './Lists';
import MazeExampleScreen from './Maze';
import ParallaxExampleScreen from './Parallax';
import ChildExampleScreen from './Children';
import InterpolateExampleScreen from './Interpolate';
import TimelineExampleScreen from './Timeline';
import EasingsExampleScreen from './Easings';
import StyleExampleScreen from './Style';
import InteractionsExampleScreen from './Interactions';
import SvgExampleScreen from './SVG';
import RepeatExampleScreen from './Repeating';

const exampleStack = createStackNavigator(
  {
    home: HomeScreen,
    styles: StylesExampleScreen,
    text: TextExampleScreen,
    appStore: AppStoreExampleScreen,
    interpolate: InterpolateExampleScreen,
    list: ListExampleScreen,
    maze: MazeExampleScreen,
    parallax: ParallaxExampleScreen,
    children: ChildExampleScreen,
    timeline: TimelineExampleScreen,
    easings: EasingsExampleScreen,
    style: StyleExampleScreen,
    interactions: InteractionsExampleScreen,
    svg: SvgExampleScreen,
    repeat: RepeatExampleScreen,
  },
  {
    initialRouteName: 'home',
  },
);

const AppNavigator = createAppContainer(exampleStack);

const styles = StyleSheet.create({
  container: {backgroundColor: 'white'},
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  imageContainerHidden: {
    transform: [{scale: 0.0009}],
  },
});

const App = () => {
  const [loading, setLoading] = useState(true);
  const toggleLoading = useCallback(() => setLoading(!loading), [loading]);

  const loadingState = {name: 'loading', active: loading};
  const config = Fluid.createConfig({
    animation: {
      type: 'timing',
      duration: 500,
      delay: 500,
      easing: Easings.back(),
    },
    onEnter: {
      state: 'loading',
      onEnd: toggleLoading,
      interpolation: {
        styleKey: 'transform.scale',
        outputRange: [1, 0.00009],
      },
    },
  });

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      {loading && (
        <Fluid.View
          label="loadingImage"
          staticStyle={styles.imageContainer}
          config={config}
          states={loadingState}>
          <Image
            source={require('./Assets/logo-symbol-text.png')}
            style={{width: 300, height: 249}}
          />
        </Fluid.View>
      )}
      {!loading && <AppNavigator />}
    </View>
  );
};

export default App;
