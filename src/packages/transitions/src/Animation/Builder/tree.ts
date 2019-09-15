import { Animations, AnimationNode } from "./types";
import { DefaultTime } from "../../Utilities";
import * as Constants from "../../Types/Constants";
import { TransitionItem } from "../../Components/Types/TransitionItem";
import { InterpolationInfo } from "../../Components/Types/InterpolationTypes";
import { ChildAnimationDirection } from "../../Configuration";

/**
 *
 * @description Returns tree of interpolation nodes from a parent (animation context)
 * transition item. This is the function to call from outside when setting up
 * interpolations.
 * @param item Root item to build tree from
 * @returns
 */
export function getInterpolationTree(
  item: TransitionItem,
  interpolations: Array<InterpolationInfo>,
  interpolationIds: Array<number>
): AnimationNode | undefined {
  // Build Tree
  const tree = createInterpolationNode(item, interpolations);

  // Get hash of items with interpolation
  const hash = getInterpolations(interpolationIds);

  // Trim tree of nodes to only include those containing interpolations
  // or having children with interpolation
  return getReducedInterpolationTree(tree, hash);
}

/**
 *
 * @description Returns a hash-map of ids for transition items that have
 * interpolations
 * @param ids list of transition item ids with interpolation
 * @returns A tree with interpolation
 */
export function getInterpolations(ids: Array<number>): Animations {
  // Identifiers of interpolation nodes
  const interpolationIds: { [key: string]: boolean } = {};
  ids.forEach(id => (interpolationIds[id] = true));
  return interpolationIds;
}

/**
 *
 * @param root Root node in tree
 * @param interpolations interpolation id hash map
 * @returns tree of items with interpolation or undefined if there
 * are no items with interpolation
 */
export function getReducedInterpolationTree(
  root: AnimationNode,
  interpolations: Animations
): AnimationNode | undefined {
  // Removed nodes without interpolations
  const retVal = reduceSubtree(root, interpolations);
  if (retVal !== undefined) {
    resolveAsChildrenDurations(retVal);
    resolveAsContextDurations(retVal, retVal.subtreeDuration || DefaultTime);
  }

  // Calculate offsets
  return retVal ? calculateOffset(retVal) : undefined;
}

export const flattenTree = (nodes: Array<AnimationNode>) => {
  const nodeList = new Array<AnimationNode>();
  nodes.forEach(n => flattenNode(n, nodeList));
  return nodeList;
};

const flattenNode = (node: AnimationNode, nodeList: Array<AnimationNode>) => {
  nodeList.push(node);
  node.children.forEach(c => flattenNode(c, nodeList));
};

/**
 *
 * @description Finds a node by interpolator id in the tree
 * @param interpolationId interpolator id to find
 * @param node node to search from
 */
export function findNodeByInterpolationId(
  interpolationId: number,
  node: AnimationNode
): AnimationNode | undefined {
  if (node.interpolationId === interpolationId) return node;
  for (let i = 0; i < node.children.length; i++) {
    const child = findNodeByInterpolationId(interpolationId, node.children[i]);
    if (child) return child;
  }
  return undefined;
}

/***********************************************************************/
/** Private functions  **/
function calculateOffset(node: AnimationNode) {
  node.offset = getNodeOffset(node);
  node.children.forEach(child => calculateOffset(child));
  return node;
}

function reduceSubtree(
  node: AnimationNode,
  interpolationIds: { [key: string]: boolean }
): AnimationNode | undefined {
  // Map children
  node.children = node.children
    .map(child => reduceSubtree(child, interpolationIds))
    .filter(child => child !== undefined) as Array<AnimationNode>;

  if (interpolationIds[node.id] || node.children.length > 0) {
    // calculate duration
    if (node.children.length > 0) {
      const subtreeDuration = getSubtreeDuration(node);

      node.subtreeDuration = Math.max(
        subtreeDuration,
        interpolationIds[node.id] ? node.duration + node.delay : -1
      );
    } else {
      node.subtreeDuration = node.duration + node.delay;
    }
    return node;
  }

  return undefined;
}

function resolveAsChildrenDurations(
  node: AnimationNode,
  inheritedDuration: number = DefaultTime
) {
  if (
    node.subtreeDuration === Constants.AsGroup ||
    node.subtreeDuration === -1
  ) {
    node.duration = inheritedDuration;
  }

  node.children.forEach(child =>
    resolveAsChildrenDurations(
      child,
      node.subtreeDuration === -1 ? inheritedDuration : node.subtreeDuration
    )
  );
}

function resolveAsContextDurations(
  node: AnimationNode,
  contextDuration: number
) {
  if (node.subtreeDuration === Constants.AsContext) {
    node.duration = contextDuration;
  }

  node.children.forEach(child =>
    resolveAsContextDurations(child, contextDuration)
  );
}

const getSortedChildren = (
  children: AnimationNode[],
  childDirection?: ChildAnimationDirection
): AnimationNode[] => {
  if (childDirection === ChildAnimationDirection.Forward) {
    // TODO: Add support for sorting children by position!
    return children;
  } else if (childDirection === ChildAnimationDirection.Backward) {
    return children.slice().reverse();
  } else {
    // Check for other types of child sorting - metrics etc.
    const hasMetrics = children.filter(s => s.metrics.x === -1).length === 0;
    if (!hasMetrics) {
      return children;
    }
    return children;
  }
};

function getNodeOffset(node: AnimationNode): number {
  const parent = node.parent;
  if (!parent) {
    return node.delay;
  }

  // Index in parent
  const currentOffset = node.parent ? node.parent.offset : 0;
  const index = parent.children.indexOf(node);
  switch (parent.childAnimation) {
    case "parallel":
      return currentOffset + node.delay;
    case "sequential":
      return parent.children.reduce((acc, c, i) => {
        return acc + (i < index ? c.subtreeDuration || 0 : 0);
      }, currentOffset);
    case "staggered":
      return parent.children.reduce((acc, _, i) => {
        return i < index ? acc + parent.stagger : acc;
      }, currentOffset);
  }
}

function getSubtreeDuration(node: AnimationNode): number {
  const children = node.children.filter(c => c.duration >= 0);
  if (children.length === 0) return Constants.AsGroup;
  switch (node.childAnimation) {
    case "parallel":
      return children.reduce(
        (acc, c) => Math.max(c.subtreeDuration || 0, acc),
        0
      );
    case "sequential":
      return children.reduce((acc, c) => (c.subtreeDuration || 0) + acc, 0);
    case "staggered":
      return children.reduce(
        (accObj, c) => {
          return {
            offset: accObj.offset + node.stagger,
            value: Math.max(
              accObj.value,
              accObj.offset + (c.subtreeDuration || 0)
            )
          };
        },
        { value: 0, offset: 0 }
      ).value;
  }
}

function createInterpolationNode(
  item: TransitionItem,
  interpolations: Array<InterpolationInfo>,
  parent?: AnimationNode,
  childDirection?: ChildAnimationDirection
): AnimationNode {
  // Find interpolations belonging to this element
  const itemInterpolations = interpolations.filter(i => i.itemId === item.id);
  const singleInterpolation =
    itemInterpolations.length === 1 ? itemInterpolations[0] : undefined;

  const configuration = item.configuration();

  // Calculate stagger and child animation type
  const resolvedChildAnimation = configuration.childAnimation || {
    type: "parallel"
  };
  const resolvedChildDirection =
    (configuration.childAnimation && configuration.childAnimation.direction) ||
    childDirection ||
    "forward";

  const resolvedStagger =
    (configuration.childAnimation &&
      configuration.childAnimation.type === "staggered" &&
      configuration.childAnimation.staggerMs) ||
    Constants.DefaultStaggerMs;

  const node: AnimationNode = {
    id: item.id,
    label: item.label,
    parent,
    children: [],
    metrics: item.metrics(),
    offset: -1,
    stagger: resolvedStagger,
    childAnimation: resolvedChildAnimation.type,
    childDirection: resolvedChildDirection,
    duration:
      (singleInterpolation &&
        singleInterpolation.animationType &&
        singleInterpolation.animationType.type === "timing" &&
        singleInterpolation.animationType.duration) ||
      DefaultTime,
    delay:
      (singleInterpolation &&
        singleInterpolation.animationType &&
        singleInterpolation.animationType.delay) ||
      0,
    interpolationId:
      singleInterpolation !== undefined ? singleInterpolation.id : -1
  };

  const ipChildren = singleInterpolation
    ? []
    : itemInterpolations.map(ip => ({
        id: item.id,
        parent: node,
        label: item.label,
        children: [],
        metrics: item.metrics(),
        offset: -1,
        childAnimation: "-",
        childDirection: "-",
        stagger: 0,
        interpolationId: ip.id,
        duration:
          (ip.animationType &&
            ip.animationType.type === "timing" &&
            ip.animationType.duration) ||
          0,
        delay: (ip.animationType && ip.animationType.delay) || 0,
        animation: ip.animationType
      }));

  node.children = getSortedChildren(
    item
      .children()
      .map(i =>
        createInterpolationNode(i, interpolations, node, resolvedChildDirection)
      )
      .concat(ipChildren as Array<AnimationNode>),
    resolvedChildDirection
  );

  return node;
}
