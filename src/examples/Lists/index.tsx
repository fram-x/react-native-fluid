import React, {useState, useRef} from 'react';
import {Button, Text, View, Dimensions, StyleSheet} from 'react-native';
import Fluid from 'react-native-fluid-transitions';
import {Transitioning, Transition as TI} from 'react-native-reanimated';
import {ColorC} from '../colors';
import {generateImageUri} from '../helpers';

interface DataItem {
  id: number;
  value: string;
  uri?: string;
}

const mapData = (data: DataItem[]) => {
  return data.map(di => ({
    ...di,
    uri: generateImageUri(di.id, 40, 40),
  }));
};

const initialData = mapData([
  {id: 1, value: 'Item 1'},
  {id: 2, value: 'Item 2'},
  {id: 3, value: 'Item 3'},
  {id: 4, value: 'Item 4'},
  {id: 5, value: 'Item 5'},
  {id: 6, value: 'Item 6'},
]);

const changedData = mapData([
  {id: 3, value: 'Item 3'},
  {id: 2, value: 'Item 2'},
  {id: 8, value: 'Item 8'},
  {id: 6, value: 'Item 6'},
  {id: 9, value: 'Item 9'},
  {id: 4, value: 'Item 4'},
  {id: 7, value: 'Item 7'},
]);

const transition = (
  <TI.Together>
    <TI.Out type="scale" durationMs={550} interpolation="easeInOut" />
    <TI.Change propagation="top" interpolation="easeInOut" durationMs={550} />
    <TI.In type="slide-left" durationMs={550} interpolation="easeInOut" />
  </TI.Together>
);

const ListExampleScreen = () => {
  const [data, setData] = useState(initialData);
  const ref = useRef<any>();

  const handleChange = () => {
    if (data === initialData) setData(changedData);
    else setData(initialData);
    ref.current && ref.current.animateNextTransition();
  };

  const handleDeleteRow = (r: DataItem) => {
    setData(data.filter(d => d !== r));
    ref.current && ref.current.animateNextTransition();
  };

  const itemConfig = Fluid.createConfig({
    animation: Fluid.Animations.Springs.Default,
    onEnter: {
      state: Fluid.Constants.StateMounted,
      interpolation: {
        inputRange: [0, 0.5, 1],
        outputRange: [0, 20, 0],
        styleKey: 'transform.translateY',
      },
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <Fluid.ScrollView
          style={styles.list}
          label="container"
          config={{
            childAnimation: {type: 'staggered', staggerMs: 50},
          }}>
          <Transitioning.View transition={transition} ref={ref}>
            {data.map(data => (
              <Fluid.View
                label={'row' + data.id}
                key={data.id}
                onPress={() => handleDeleteRow(data)}
                initialStyle={styles.rowUnmounted}
                style={styles.row}
                config={itemConfig}>
                <Image source={{uri: data.uri}} style={styles.image} />
                <Text>{data.value}</Text>
              </Fluid.View>
            ))}
          </Transitioning.View>
        </Fluid.ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <Button title={'Change'} onPress={handleChange} />
      </View>
    </View>
  );
};

ListExampleScreen.navigationOptions = {
  title: 'List',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  listContainer: {
    height: Dimensions.get('window').height * 0.6,
  },
  list: {
    width: Dimensions.get('window').width * 0.85,
    backgroundColor: ColorC,
    borderRadius: 8,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  rowUnmounted: {
    transform: [{rotateX: '90deg'}],
  },
  rowDetached: {
    transform: [{translateX: Dimensions.get('window').width}],
  },
  row: {
    padding: 4,
    paddingRight: 14,
    borderRadius: 8,
    backgroundColor: '#FFF',
    margin: 8,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    padding: 8,
    margin: 10,
  },
  buttonPressed: {
    transform: [{scale: 0.95}],
  },
  buttonContainer: {
    flexDirection: 'row',
  },
});

export default ListExampleScreen;
