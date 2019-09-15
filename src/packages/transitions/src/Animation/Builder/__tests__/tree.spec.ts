import { AnimationNode } from "../types";
import { getReducedInterpolationTree } from "../tree";
import { Metrics } from "../../../Types";
import * as Constants from "../../../Types/Constants";
import { DefaultTime } from "../../../Utilities";

describe("getInterpolationTree / duration", () => {
  it("should return the correct child duration for staggered interpolations", () => {
    const tree = createSimpleTree({
      id: 1,
      childAnimation: "staggered",
      stagger: 100,
      children: [
        { id: 2, duration: 100 },
        { id: 3, duration: 300 },
        { id: 4, duration: 100 }
      ]
    });
    const valueToTest = getReducedInterpolationTree(tree, {
      [2]: true,
      [3]: true,
      [4]: true
    });
    expect(valueToTest).toBeDefined();
    if (valueToTest) {
      expect(valueToTest.subtreeDuration).toEqual(400);
    }
  });

  it("should return the correct child duration for parallel interpolations", () => {
    const tree = createSimpleTree({
      id: 1,
      childAnimation: "parallel",
      children: [{ id: 2, duration: 100 }, { id: 3, duration: 100 }]
    });
    const valueToTest = getReducedInterpolationTree(tree, {
      [2]: true,
      [3]: true
    });
    expect(valueToTest).toBeDefined();
    if (valueToTest) {
      expect(valueToTest.subtreeDuration).toEqual(100);
    }
  });

  it("should return the correct child duration for sequential interpolations", () => {
    const tree = createSimpleTree({
      id: 1,
      childAnimation: "sequential",
      children: [{ id: 2, duration: 100 }, { id: 3, duration: 100 }]
    });
    const valueToTest = getReducedInterpolationTree(tree, {
      [2]: true,
      [3]: true
    });
    expect(valueToTest).toBeDefined();
    if (valueToTest) {
      expect(valueToTest.subtreeDuration).toEqual(200);
    }
  });

  it("should not include parent node's duration when calculating child duration", () => {
    const tree = createSimpleTree({
      id: 1,
      duration: 100,
      childAnimation: "sequential",
      children: [{ id: 2, duration: 100 }, { id: 3, duration: 100 }]
    });
    const valueToTest = getReducedInterpolationTree(tree, {
      [1]: true,
      [2]: true,
      [3]: true
    });
    expect(valueToTest).toBeDefined();
    if (valueToTest) {
      expect(valueToTest.subtreeDuration).toEqual(200);
    }
  });

  it("should return parent node's duration when larger than child duration", () => {
    const tree = createSimpleTree({
      id: 1,
      duration: 400,
      childAnimation: "sequential",
      children: [{ id: 2, duration: 100 }, { id: 3, duration: 100 }]
    });
    const valueToTest = getReducedInterpolationTree(tree, {
      [1]: true,
      [2]: true,
      [3]: true
    });
    expect(valueToTest).toBeDefined();
    if (valueToTest) {
      expect(valueToTest.subtreeDuration).toEqual(400);
    }
  });

  it("should include delay when calculating child duration", () => {
    const tree = createSimpleTree({
      id: 1,
      childAnimation: "sequential",
      children: [
        { id: 2, duration: 100, delay: 100 },
        { id: 3, duration: 100, delay: 100 }
      ]
    });
    const valueToTest = getReducedInterpolationTree(tree, {
      [2]: true,
      [3]: true
    });
    expect(valueToTest).toBeDefined();
    if (valueToTest) {
      expect(valueToTest.subtreeDuration).toEqual(400);
    }
  });

  it("should include delay when returning root node's duration", () => {
    const tree = createSimpleTree({
      id: 1,
      childAnimation: "sequential",
      duration: 300,
      delay: 200,
      children: [
        { id: 2, duration: 100, delay: 100 },
        { id: 3, duration: 100, delay: 100 }
      ]
    });
    const valueToTest = getReducedInterpolationTree(tree, {
      [1]: true,
      [2]: true,
      [3]: true
    });
    expect(valueToTest).toBeDefined();
    if (valueToTest) {
      expect(valueToTest.subtreeDuration).toEqual(500);
    }
  });

  it("should return 300 when AsGroup is set for a child", () => {
    const tree = createSimpleTree({
      id: 1,
      children: [
        { id: 2, duration: 300 },
        { id: 3, duration: Constants.AsGroup }
      ]
    });
    const valueToTest = getReducedInterpolationTree(tree, {
      [2]: true,
      [3]: true
    });
    expect(valueToTest).toBeDefined();
    if (valueToTest) {
      expect(valueToTest.children[1].duration).toBe(300);
    }
  });

  it("should return 500 when AsGroup is set for a child in a complex nested tree", () => {
    const tree = createSimpleTree({
      id: 1,
      children: [
        { id: 3, duration: Constants.AsGroup },
        {
          id: 2,
          duration: 300,
          children: [{ id: 4, duration: 500 }, { id: 5, duration: 300 }]
        }
      ]
    });
    const valueToTest = getReducedInterpolationTree(tree, {
      [2]: true,
      [3]: true,
      [4]: true,
      [5]: true
    });
    expect(valueToTest).toBeDefined();
    if (valueToTest) {
      expect(valueToTest.children[0].duration).toBe(500);
    }
  });

  it("should return default duration when AsGroup is set for a tree without any duration", () => {
    const tree = createSimpleTree({
      id: 0,
      children: [
        { id: 1, duration: Constants.AsGroup },
        { id: 2, duration: Constants.AsGroup }
      ]
    });
    const valueToTest = getReducedInterpolationTree(tree, {
      [1]: true,
      [2]: true
    });
    expect(valueToTest).toBeDefined();
    if (valueToTest) {
      expect(valueToTest.children[0].duration).toBe(DefaultTime);
      expect(valueToTest.children[1].duration).toBe(DefaultTime);
    }
  });

  it("should return 600 when AsChildren is set in complex tree", () => {
    const tree = createSimpleTree({
      id: 1,
      children: [
        {
          id: 2,
          duration: 100,
          children: [
            { id: 4, duration: 600 },
            { id: 5, duration: 300 },
            { id: 3, duration: Constants.AsGroup }
          ]
        },
        {
          id: 6,
          duration: 800
        }
      ]
    });
    const valueToTest = getReducedInterpolationTree(tree, {
      [3]: true,
      [4]: true,
      [5]: true,
      [6]: true
    });
    expect(valueToTest).toBeDefined();
    if (valueToTest) {
      expect(valueToTest.children[0].children[2].duration).toBe(600);
    }
  });

  it("should return 600 when AsContext is set in complex tree", () => {
    const tree = createSimpleTree({
      id: 1,
      children: [
        {
          id: 2,
          duration: 100,
          children: [
            { id: 4, duration: 600 },
            { id: 5, duration: 300 },
            { id: 3, duration: Constants.AsContext }
          ]
        },
        {
          id: 6,
          duration: 800
        }
      ]
    });
    const valueToTest = getReducedInterpolationTree(tree, {
      [3]: true,
      [4]: true,
      [5]: true,
      [6]: true
    });
    expect(valueToTest).toBeDefined();
    if (valueToTest) {
      expect(valueToTest.children[0].children[2].duration).toBe(800);
    }
  });
});

describe("getInterpolationTree / offset / root node", () => {
  it("should return the node's delay as offset for the root node", () => {
    const tree = createSimpleTree({
      id: 1,
      delay: 100,
      children: []
    });
    const valueToTest = getReducedInterpolationTree(tree, { [1]: true });
    expect(valueToTest).toBeDefined();
    if (valueToTest) {
      expect(valueToTest.offset).toEqual(100);
    }
  });

  it("should return delay as offset for the root node when it is not part of an interpolation", () => {
    const tree = createSimpleTree({
      id: 1,
      delay: 100,
      children: [{ id: 2 }]
    });
    const valueToTest = getReducedInterpolationTree(tree, { [2]: true });
    expect(valueToTest).toBeDefined();
    if (valueToTest) {
      expect(valueToTest.offset).toEqual(100);
    }
  });
});

describe("getInterpolationTree / offset / parallel", () => {
  it("should include parent offset for a child node", () => {
    const tree = createSimpleTree({
      id: 1,
      delay: 100,
      childAnimation: "parallel",
      children: [{ id: 2, delay: 100 }]
    });
    const valueToTest = getReducedInterpolationTree(tree, { [2]: true });
    expect(valueToTest).toBeDefined();
    if (valueToTest) {
      expect(valueToTest.children[0].offset).toEqual(200);
    }
  });

  it("should include parent offset for the second child node", () => {
    const tree = createSimpleTree({
      id: 1,
      delay: 100,
      childAnimation: "parallel",
      children: [{ id: 2, delay: 100 }, { id: 3, delay: 50 }]
    });
    const valueToTest = getReducedInterpolationTree(tree, {
      [2]: true,
      [3]: true
    });
    expect(valueToTest).toBeDefined();
    if (valueToTest) {
      expect(valueToTest.children[1].offset).toEqual(150);
    }
  });
});

describe("getInterpolationTree / offset / sequential", () => {
  it("should include previous node offset for second child node", () => {
    const tree = createSimpleTree({
      id: 1,
      delay: 0,
      childAnimation: "sequential",
      children: [{ id: 2, duration: 100 }, { id: 2, duration: 100 }]
    });
    const valueToTest = getReducedInterpolationTree(tree, {
      [2]: true,
      [3]: true
    });
    expect(valueToTest).toBeDefined();
    if (valueToTest) {
      expect(valueToTest.children[1].offset).toEqual(100);
    }
  });
});

describe("getInterpolationTree / offset / stagger", () => {
  it("should include previous node's offset", () => {
    const tree = createSimpleTree({
      id: 1,
      delay: 0,
      childAnimation: "staggered",
      stagger: 100,
      children: [{ id: 2, duration: 100 }, { id: 2, duration: 100 }]
    });
    const valueToTest = getReducedInterpolationTree(tree, {
      [2]: true,
      [3]: true
    });
    expect(valueToTest).toBeDefined();
    if (valueToTest) {
      expect(valueToTest.children[1].offset).toEqual(100);
    }
  });
});

/****************************************************************
  HELPERS
 ****************************************************************/

export type MockNode = {
  id: number;
  children?: Array<MockNode>;
  duration?: number;
  delay?: number;
  stagger?: number;
  childAnimation?: "staggered" | "parallel" | "sequential";
};

export const createSimpleTree = (
  mockNode: MockNode,
  parent?: AnimationNode
): AnimationNode => {
  const node: AnimationNode = {
    id: mockNode.id,
    parent,
    offset: -1,
    stagger: mockNode.stagger || 1.0,
    duration: mockNode.duration || 330,
    delay: mockNode.delay || 0,
    childAnimation: mockNode.childAnimation || "parallel",
    childDirection: "forward",
    metrics: new Metrics(-1, -1, -1, -1),
    children: [],
    interpolationId: 0
  };
  node.children = mockNode.children
    ? mockNode.children.map(c => createSimpleTree(c, node))
    : [];
  return node;
};
