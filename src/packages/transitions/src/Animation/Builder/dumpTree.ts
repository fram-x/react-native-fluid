import { AnimationNode } from "./types";

export const dumpTree = (
  tree: AnimationNode,
  output: (message?: any, ...optionalParams: any[]) => void,
  indent: number = 0
) => {
  const indentStr = new Array(indent).map(_ => "").join(" ");
  // @ts-ignore
  if (tree.childDirection === "-") {
    output(
      indentStr,
      indentStr,
      getNodeName(tree),
      "subduration:",
      // @ts-ignore
      tree.subtreeDuration.toFixed(2)
    );
  } else {
    output(
      indentStr,
      getNodeName(tree),
      "dur:",
      // @ts-ignore
      tree.duration.toFixed(2),
      "subdur:",
      // @ts-ignore
      tree.subtreeDuration.toFixed(2),
      "delay:",
      tree.delay,
      "offset:",
      tree.offset,
      "stgr:",
      tree.stagger,
      tree.childAnimation,
      tree.childDirection
    );
  }
  tree.children.forEach(c => dumpTree(c, output, indent + 2));
};

const getNodeName = (node: AnimationNode) => {
  return "[" + node.label || "id: " + node.id + "]: ";
};
