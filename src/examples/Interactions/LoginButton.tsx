import React, {useState} from 'react';
import {StyleSheet, TextStyle, Text, Dimensions} from 'react-native';
import Fluid, {
  createFluidComponent,
  Easings,
} from 'react-native-fluid-transitions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IconProps} from 'react-native-vector-icons/Icon';

import {ColorA} from '../colors';

const FluidIcon = createFluidComponent<IconProps, TextStyle>(Icon, false);
const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    width: width / 3,
    height: 44,
    borderRadius: 22,
    backgroundColor: ColorA,
  },
  loggedOut: {
    width: width / 3,
  },
  loggingIn: {
    width: 44,
  },
  text: {
    fontSize: 12,
    color: '#FFF',
  },
});

const iconConfig = Fluid.createConfig({
  when: {
    state: 'loggingIn',
    animation: {type: 'timing', duration: 800, easing: Easings.linear},
    loop: Infinity,
    interpolation: {
      outputRange: ['0deg', '360deg'],
      styleKey: 'transform.rotate',
    },
  },
});

const LoginButton = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const toggle = () => setIsLoggingIn(p => !p);
  const loginState = {name: 'loggingIn', active: isLoggingIn};

  return (
    <Fluid.View
      staticStyle={styles.container}
      style={isLoggingIn ? styles.loggingIn : styles.loggedOut}
      onPress={toggle}>
      {!isLoggingIn && <Text style={styles.text}>Login</Text>}
      {isLoggingIn && (
        <FluidIcon
          config={iconConfig}
          states={loginState}
          name="loading"
          size={22}
          color={'#FFF'}
        />
      )}
    </Fluid.View>
  );
};

export {LoginButton};
