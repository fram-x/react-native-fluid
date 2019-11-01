import { AnimationNode } from "./types";

export const dumpTree = (
  node: AnimationNode,
  output: (message?: any, ...optionalParams: any[]) => void,
  indent: number = 0,
) => {
  const indentStr = new Array(indent).map(_ => "").join(" ");
  // @ts-ignore
  if (node.childDirection === "-") {
    output(
      indentStr,
      indentStr,
      getNodeName(node),
      "subduration:",
      // @ts-ignore
      node.subtreeDuration.toFixed(2),
    );
  } else {
    output(
      indentStr,
      getNodeName(node),
      "dur:",
      node.duration.toFixed(2),
      "anim:",
      node.animation ? node.animation.type : "unknown",
      "subdur:",
      // @ts-ignore
      node.subtreeDuration.toFixed(2),
      "delay:",
      node.delay,
      "offset:",
      node.offset,
      "stgr:",
      node.stagger,
      node.childAnimation,
      node.childDirection,
    );
  }
  node.children.forEach(c => dumpTree(c, output, indent + 2));
};

const getNodeName = (node: AnimationNode) => {
  return "[" + node.label || "id: " + node.id + "]: ";
};
