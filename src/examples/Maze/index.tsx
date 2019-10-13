import React, { useState, useRef } from "react";
import { Dimensions } from "react-native";
import Fluid from "react-native-fluid-transitions";
import { styles } from "./styles";
import { MazeItem } from "./MazeItem";

const columns = 6;

const { width, height } = Dimensions.get("window");
const boxSize = width / columns;

const createMaze = () => {
  const nextMaze: boolean[] = [];
  for (let y = 0; y < height / boxSize; y++) {
    for (let x = 0; x < columns; x++) {
      nextMaze.push(Math.random() < 0.5);
    }
  }
  return nextMaze;
};

const swapMaze = (maze: Array<boolean>) => {
  const nextMaze: Array<boolean> = [];
  let i = 0;
  for (let y = 0; y < height / boxSize; y++) {
    for (let x = 0; x < columns; x++) {
      nextMaze.push(!maze[i++]);
    }
  }
  return nextMaze;
};

const MazeExampleScreen = () => {
  const [maze, setMaze] = useState(() => createMaze());
  const cur = useRef(1);
  if (cur.current === 0) {
    cur.current = 1;
  } else {
    cur.current = 0;
  }
  const toggleLabyrinth = () => {
    setMaze(swapMaze(maze));
  };

  return (
    <Fluid.View
      label="container"
      config={{ childAnimation: { type: "staggered", stagger: 25 } }}
      style={styles.container}
      onPress={toggleLabyrinth}>
      {/* <MazeItem key={0} isSet={maze[0]} index={0} size={boxSize} /> */}
      {maze.map((b, index) => (
        <MazeItem key={index} isSet={b} index={index} size={boxSize} />
      ))}
    </Fluid.View>
  );
};

MazeExampleScreen.navigationOptions = {
  title: "Maze",
};

export default MazeExampleScreen;
