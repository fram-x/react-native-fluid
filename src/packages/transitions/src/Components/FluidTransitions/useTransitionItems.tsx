import { useRef, useContext, useEffect } from "react";
import { TransitionItem, TransitionItemContext } from "../Types";

/**
 * @description Maintains a list of transition items
 */
export const useTransitionItems = (transitionItem: TransitionItem) => {
  const transitionItems = useRef<Array<TransitionItem>>([]);
  const isRegistered = useRef(false);
  const isAliveRef = useRef(true);
  const context = useContext(TransitionItemContext);
  if (!isRegistered.current && context) {
    context.registerTransitionItem(transitionItem);
    isRegistered.current = true;
  }

  const getOwner = () => transitionItem;

  const registerTransitionItem = (item: TransitionItem) => {
    transitionItems.current.push(item);
  };

  const unregisterTransitionItem = (id: number) => {
    const item = transitionItems.current.find(it => it.id === id);
    if (item) {
      const index = transitionItems.current.indexOf(item);
      transitionItems.current.splice(index, 1);
    }
  };

  const getTransitionItemByLabel = (label: string) => {
    // Enum func
    const getChild = (
      childLabel: string,
      ti: TransitionItem,
    ): TransitionItem | undefined => {
      if (ti.label === childLabel) return ti;
      const children = ti.children();
      for (let n = 0; n < children.length; n++) {
        if (children[n].label === childLabel) {
          return children[n];
        }
        const c = getChild(childLabel, children[n]);
        if (c) {
          return c;
        }
      }
      return undefined;
    };

    // Search
    for (let i = 0; i < transitionItems.current.length; i++) {
      const retVal = getChild(label, transitionItems.current[i]);
      if (retVal) {
        return retVal;
      }
    }
    // throw new Error("Could not find transition item with label " + label);
    return undefined;
  };

  // Mount/unmount
  useEffect(() => {
    // Just return for unregistering
    return () => {
      isAliveRef.current = false;
      if (context) {
        context.unregisterTransitionItem(transitionItem.id);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    transitionItemContext: {
      registerTransitionItem,
      unregisterTransitionItem,
      getTransitionItemByLabel,
      getOwner,
    },
    isAliveRef: isAliveRef,
    transitionItems: transitionItems.current,
  };
};
