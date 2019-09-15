import React, {useState, useRef} from 'react';
import {
  ScrollView,
  Image,
  Dimensions,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Fluid from 'react-native-fluid-transitions';
import {generateRandomImageUri} from '../helpers';

const loremText =
  'Lorem ipsum dolor sit amet, eam magna molestiae vituperata ex, exerci vivendum mediocritatem pri ne. Usu et fuisset pertinax repudiandae, at habemus definitiones eam, mea id quodsi convenire corrumpit. At has nemore mentitum, est putant intellegam repudiandae at, id illum omnium tincidunt vel. Id dolor invenire duo. Cum paulo labores ut. Ut tritani dignissim delicatissimi mei.';
const cardItems = [
  {
    id: 1,
    title: 'GET STARTED',
    subtitle: "Let's code",
    image: generateRandomImageUri(),
  },
  {
    id: 2,
    title: "TODAY'S LIST",
    subtitle: 'Engaging games',

    image: generateRandomImageUri(),
  },
  {
    id: 3,
    title: "HOW TO'S",
    subtitle: 'For small businesses',
    image: generateRandomImageUri(),
  },
];

const Card: React.FunctionComponent<{
  title: string;
  subTitle: string;
  image: string;
  selected: boolean;
  onPress: () => void;
}> = ({title, subTitle, image, selected, onPress}) => {
  const config = Fluid.createConfig({
    animation: Fluid.Animations.Springs.Gentle,
    when: {state: 'pressed', style: styles.cardPressed},
  });

  return (
    <Fluid.View
      style={[
        styles.cardContainer,
        selected ? styles.cardContainerSelected : {},
      ]}
      config={config}
      onPress={onPress}>
      <Fluid.View style={[styles.card, selected ? styles.cardSelected : {}]}>
        <Image source={{uri: image}} style={StyleSheet.absoluteFill} />
        <View style={styles.cardTitleContainer}>
          <Text style={styles.textTitle}>{title}</Text>
          <Text style={styles.textSubtitle}>{subTitle}</Text>
        </View>
      </Fluid.View>
      <ScrollView style={styles.cardTextContainer}>
        <Text>{loremText}</Text>
      </ScrollView>
    </Fluid.View>
  );
};

const AppStoreExampleScreen = () => {
  const [selected, setSelected] = useState(-1);
  const scrollRef = useRef();

  return (
    <ScrollView
      // @ts-ignore
      ref={scrollRef}
      contentContainerStyle={styles.scrollView}
      scrollEnabled={selected === -1}>
      <View style={styles.container}>
        {cardItems.map((cardItem, index) => (
          <Card
            key={cardItem.id}
            title={cardItem.title}
            subTitle={cardItem.subtitle}
            image={cardItem.image}
            onPress={() => {
              cardItem.id === selected
                ? setSelected(-1)
                : setSelected(cardItem.id);
              if (cardItem.id !== selected) {
                // @ts-ignore
                scrollRef.current.scrollTo({
                  y: index * (cardHeight + 20),
                });
              }
            }}
            selected={cardItem.id === selected}
          />
        ))}
      </View>
    </ScrollView>
  );
};

AppStoreExampleScreen.navigationOptions = {
  title: 'AppStore',
};

const cardHeight = 324;
const cardPadding = 14;
const cardFullHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  scrollView: {},
  container: {
    flex: 1,
  },
  cardContainer: {
    height: cardHeight + cardPadding,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardContainerSelected: {
    height: cardFullHeight,
  },
  cardPressed: {
    transform: [{scale: 0.98}],
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#CCC',
    height: cardHeight,
    margin: cardPadding,
  },
  cardSelected: {
    borderRadius: 0,
    margin: 0,
  },
  cardTitleContainer: {
    padding: 14,
  },
  textTitle: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  textSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  cardTextContainer: {
    backgroundColor: 'white',
    padding: 14,
    height: 0,
  },
  cardText: {
    fontSize: 12,
  },
});

export default AppStoreExampleScreen;
