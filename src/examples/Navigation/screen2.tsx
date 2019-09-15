import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { NavigationInjectedProps } from "react-navigation";
import { Fluid, NavForwardTo, NavBackTo } from "react-native-fluid-navigation";
import { navigationStyles } from "./styles";
import * as Colors from "../colors";

class Screen2 extends React.PureComponent<NavigationInjectedProps> {
  onPressBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  onPressNext = () => {
    const { navigation } = this.props;
    navigation.navigate("screen3");
  };

  render() {
    return (
      <Fluid.View
        style={navigationStyles.container}
        config={<Fluid.Configuration childAnimation="staggered" />}
      >
        <Fluid.Text config={<Fluid.Transitions.Flip />}>Screen 2</Fluid.Text>
        <View
          style={[navigationStyles.elementContainer, styles.sharedContainer]}
        >
          <Fluid.View
            style={styles.circleA}
            label="circleA"
            config={
              <Fluid.Configuration>
                <Fluid.On state={NavForwardTo} type="enter">
                  <Fluid.Shared fromLabel={"boxA"} />
                </Fluid.On>
                <Fluid.Transitions.Horizontal backFrom={false} />
              </Fluid.Configuration>
            }
          />
          <Fluid.View
            style={styles.circleB}
            label="circleB"
            config={
              <Fluid.Configuration>
                <Fluid.On state={NavForwardTo} type="enter">
                  <Fluid.Shared fromLabel={"boxB"} />
                </Fluid.On>
                <Fluid.Transitions.Horizontal backFrom={false} />
              </Fluid.Configuration>
            }
          />
          <Fluid.View
            style={styles.circleC}
            label="circleC"
            config={
              <Fluid.Configuration>
                <Fluid.On state={NavForwardTo} type="enter">
                  <Fluid.Shared fromLabel={"boxC"} />
                </Fluid.On>
                <Fluid.On state={NavBackTo} type="enter">
                  <Fluid.Shared fromLabel={"ball3-3"} />
                </Fluid.On>
              </Fluid.Configuration>
            }
          />
          <Fluid.View
            style={navigationStyles.sharedBorder}
            config={<Fluid.Transitions.Vertical />}
          />
        </View>
        <Fluid.View label={"buttons2"} style={styles.buttons}>
          <Button title="Back" onPress={this.onPressBack} />
          <Button title="Next" onPress={this.onPressNext} />
        </Fluid.View>
      </Fluid.View>
    );
  }
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row"
  },
  sharedContainer: {
    alignItems: "flex-end",
    backgroundColor: "yellow"
  },
  circleA: {
    width: 40,
    height: 40,
    backgroundColor: Colors.ColorA,
    margin: 10,
    borderRadius: 20
  },
  circleB: {
    width: 40,
    height: 40,
    backgroundColor: Colors.ColorB,
    margin: 10,
    borderRadius: 20
  },
  circleC: {
    width: 40,
    height: 40,
    backgroundColor: Colors.ColorC,
    margin: 10,
    borderRadius: 20
  }
});

export default Screen2;
