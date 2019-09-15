import React from 'react';
import {Image, View, Text, StyleSheet, Dimensions} from 'react-native';
import Fluid from 'react-native-fluid-transitions';
import * as Colors from '../colors';
import {generateImageUri} from '../helpers';

const HeaderHeight = 52;

const ParallaxExampleScreen = () => {
  const size = Dimensions.get('window');
  const imageOffset = -80;

  // @ts-ignore
  const data = Array.apply(null, {length: 24})
    .map(Function.call, Number)
    .map((s: string) => 'Test ' + s.toString());

  const {width: imageSize} = size;
  const uri = generateImageUri(20, imageSize, imageSize);

  const value = {
    ownerLabel: 'scroller',
    valueName: 'scrollY',
  };

  const imageConfig = Fluid.createConfig({
    interpolation: {
      styleKey: 'transform.scale',
      inputRange: [-25, 0],
      outputRange: [1.1, 1],
      extrapolateRight: 'clamp',
      value,
    },
  });

  const headerContainerConfig = Fluid.createConfig({
    interpolation: {
      styleKey: 'backgroundColor',
      inputRange: [0, imageSize - HeaderHeight + imageOffset],
      outputRange: ['#FBB95800', Colors.ColorC],
      extrapolate: 'clamp',
      value,
    },
  });

  const headerTextConfig = Fluid.createConfig({
    interpolation: [
      {
        styleKey: 'transform.scale',
        inputRange: [0, imageSize - HeaderHeight + imageOffset],
        outputRange: [1.5, 1],
        extrapolateRight: 'clamp',
        value,
      },
      {
        styleKey: 'transform.translateX',
        inputRange: [0, imageSize - HeaderHeight + imageOffset],
        outputRange: [14, 1],
        extrapolateRight: 'clamp',
        value,
      },
      {
        styleKey: 'color',
        inputRange: [0, imageSize - HeaderHeight + imageOffset],
        outputRange: [Colors.ColorC, '#FFF'],
        extrapolate: 'clamp',
        value,
      },
    ],
  });

  return (
    <Fluid.View staticStyle={styles.container} label="container">
      <Fluid.ScrollView label={'scroller'}>
        <Fluid.View
          label="image"
          style={{
            width: imageSize,
            height: imageSize + imageOffset,
            backgroundColor: '#CCC',
            transform: [{translateY: imageOffset}],
          }}
          config={imageConfig}>
          <Image
            source={{uri}}
            style={{
              width: imageSize,
              height: imageSize,
            }}
          />
        </Fluid.View>

        <Fluid.View staticStyle={styles.itemContainer}>
          {data.map((d: string) => (
            <View key={d} style={styles.item}>
              <Text>{d}</Text>
            </View>
          ))}
        </Fluid.View>
      </Fluid.ScrollView>
      <Fluid.View
        staticStyle={styles.headerContainer}
        config={headerContainerConfig}>
        <Fluid.Text staticStyle={styles.headerText} config={headerTextConfig}>
          YOUR HOMEWORK
        </Fluid.Text>
      </Fluid.View>
    </Fluid.View>
  );
};

ParallaxExampleScreen.navigationOptions = {
  title: 'Parallax',
  headerStyle: {
    backgroundColor: Colors.ColorC,
    shadowColor: 'transparent',
    borderBottomWidth: 0,
  },
  headerTintColor: '#FFF',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: HeaderHeight,
  },
  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 14,
  },
  itemContainer: {
    backgroundColor: '#EFEFEF',
  },
  item: {
    padding: 14,
    borderRadius: 8,
    borderColor: '#CCC',
    backgroundColor: '#FFF',
    borderWidth: StyleSheet.hairlineWidth,
    margin: 8,
    marginBottom: 0,
    height: 65,
    justifyContent: 'center',
  },
});

export default ParallaxExampleScreen;
