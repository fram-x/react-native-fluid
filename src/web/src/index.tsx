import App from "./Maze";
import * as serviceWorker from "./serviceWorker";
import { AppRegistry } from "react-native";

// register the app
AppRegistry.registerComponent("App", () => App);

AppRegistry.runApplication("App", {
  initialProps: {},
  rootTag: document.getElementById("root"),
});

serviceWorker.unregister();
