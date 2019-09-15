import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { NavigationInjectedProps } from "react-navigation";
import { Fluid, NavBackTo } from "react-native-fluid-navigation";
import { navigationStyles } from "./styles";
import * as Colors from "../colors";

class Screen1 extends React.PureComponent<NavigationInjectedProps> {
  onPress = () => {
    const { navigation } = this.props;
    navigation.navigate("screen2");
  };

  render() {
    return (
      <View style={navigationStyles.container}>
        <Fluid.Text config={<Fluid.Transitions.Flip />}>Screen 1</Fluid.Text>

        <View
          style={[navigationStyles.elementContainer, styles.sharedContainer]}
        >
          <Fluid.View
            style={styles.squareA}
            label="boxA"
            config={
              <Fluid.Configuration>
                <Fluid.On state={NavBackTo} type="enter">
                  <Fluid.Shared fromLabel={"circleA"} />
                </Fluid.On>
              </Fluid.Configuration>
            }
          />
          <Fluid.View
            style={styles.squareB}
            label="boxB"
            config={
              <Fluid.Configuration>
                <Fluid.On state={NavBackTo} type="enter">
                  <Fluid.Shared fromLabel={"circleB"} />
                </Fluid.On>
              </Fluid.Configuration>
            }
          />
          <Fluid.View
            style={styles.squareC}
            label="boxC"
            config={
              <Fluid.Configuration>
                <Fluid.On state={NavBackTo} type="enter">
                  <Fluid.Shared fromLabel={"circleC"} />
                </Fluid.On>
              </Fluid.Configuration>
            }
          />
          <Fluid.View
            style={navigationStyles.sharedBorder}
            config={<Fluid.Transitions.Vertical />}
          />
        </View>
        <Fluid.View label="buttons1">
          <Button title="Next" onPress={this.onPress} />
        </Fluid.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  squareA: {
    width: 40,
    height: 40,
    backgroundColor: Colors.ColorA,
    margin: 10
  },
  squareB: {
    width: 40,
    height: 40,
    backgroundColor: Colors.ColorB,
    margin: 10
  },
  squareC: {
    width: 40,
    height: 40,
    backgroundColor: Colors.ColorC,
    margin: 10
  },
  sharedContainer: {
    backgroundColor: "aqua",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Screen1;
