import { useState, Dispatch, SetStateAction, useRef } from "react";
import { ConfigStateType } from "../Configuration";

let StateNameId = 1000;
const StateNamePrefix = "State";

function useFluidState(
  initialState: boolean | (() => boolean),
): [ConfigStateType, Dispatch<SetStateAction<boolean>>] {
  const [value, setValue] = useState<boolean>(initialState);
  const stateRef = useRef<ConfigStateType>();
  if (!stateRef.current) {
    stateRef.current = {
      name: `${StateNamePrefix}${StateNameId++}`,
      active: value,
      negated: {
        name: `${StateNamePrefix}${StateNameId++}`,
        active: !value,
      },
    };
  } else {
    stateRef.current.active = value;
    if (stateRef.current.negated) {
      stateRef.current.negated.active = !value;
    }
  }
  return [stateRef.current, setValue];
}

export { useFluidState };
