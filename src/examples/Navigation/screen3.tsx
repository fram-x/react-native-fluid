import React from "react";
import { Button, StyleSheet } from "react-native";
import { NavigationInjectedProps } from "react-navigation";
import { Fluid, NavForwardTo } from "react-native-fluid-navigation";
import * as Colors from "../colors";
import { navigationStyles } from "./styles";

class Screen3 extends React.PureComponent<NavigationInjectedProps> {
  onPress = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  render() {
    return (
      <Fluid.View
        style={navigationStyles.container}
        config={<Fluid.Configuration childAnimation="staggered" />}
      >
        <Fluid.Text config={<Fluid.Transitions.Flip />}>Screen 3</Fluid.Text>
        <Fluid.View
          label="ball1-3"
          style={styles.ball1}
          config={<Fluid.Transitions.Horizontal />}
        />
        <Fluid.View
          label="ball2-3"
          style={styles.ball2}
          config={<Fluid.Transitions.Horizontal />}
        />
        <Fluid.View
          label="ball3-3"
          style={styles.ball3}
          config={
            <Fluid.Configuration>
              <Fluid.On state={NavForwardTo} type="enter">
                <Fluid.Shared fromLabel={"circleC"} />
              </Fluid.On>
            </Fluid.Configuration>
          }
        />
        <Fluid.View label="buttons3">
          <Button title="Back" onPress={this.onPress} />
        </Fluid.View>
      </Fluid.View>
    );
  }
}

const styles = StyleSheet.create({
  ball1: {
    margin: 10,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.ColorA
  },
  ball2: {
    margin: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.ColorB
  },
  ball3: {
    margin: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.ColorC
  }
});

export default Screen3;
