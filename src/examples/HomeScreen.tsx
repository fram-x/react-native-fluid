import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import HomeScreenButton from './HomeScreenButton';

class HomeScreen extends React.PureComponent<any> {
  static navigationOptions = {
    title: 'Fluid Transitions',
  };

  openExample = (route: string) => {
    const {navigation} = this.props;
    navigation.navigate(route);
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.list}>
          <HomeScreenButton
            text="Styles"
            icon="border-style"
            onPress={() => this.openExample('styles')}
          />
          <HomeScreenButton
            text="AppStore"
            icon="vector-intersection"
            onPress={() => this.openExample('appStore')}
          />
          <HomeScreenButton
            text="Parallax"
            icon="script-outline"
            onPress={() => this.openExample('parallax')}
          />
          <HomeScreenButton
            text="Children"
            icon="view-list"
            onPress={() => this.openExample('children')}
          />
          <HomeScreenButton
            text="Text"
            icon="format-text"
            onPress={() => this.openExample('text')}
          />
          <HomeScreenButton
            text="Maze"
            icon="square-outline"
            onPress={() => this.openExample('maze')}
          />
          <HomeScreenButton
            text="List"
            icon="format-list-bulleted"
            onPress={() => this.openExample('list')}
          />
          <HomeScreenButton
            text="SVG"
            icon="svg"
            onPress={() => this.openExample('svg')}
          />
          <HomeScreenButton
            text="Interpolate"
            icon="nintendo-switch"
            onPress={() => this.openExample('interpolate')}
          />
          <HomeScreenButton
            text="Spotify"
            icon="music"
            onPress={() => this.openExample('spotify')}
          />
          <HomeScreenButton
            text="Timeline"
            icon="altimeter"
            onPress={() => this.openExample('timeline')}
          />
          <HomeScreenButton
            text="Style"
            icon="border-style"
            onPress={() => this.openExample('style')}
          />
          <HomeScreenButton
            text="Easings"
            icon="chart-line"
            onPress={() => this.openExample('easings')}
          />
          <HomeScreenButton
            text="Interactions"
            icon="gesture-tap"
            onPress={() => this.openExample('interactions')}
          />
          <HomeScreenButton
            text="Repeating"
            icon="chevron-double-right"
            onPress={() => this.openExample('repeat')}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

export default HomeScreen;
