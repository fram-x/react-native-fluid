import { useState, Dispatch, SetStateAction, useRef } from "react";
import { ConfigStateType } from "../Configuration";

let StateNameId = 1000;
const StateNamePrefix = "State";

function useFluidState(
  initialState: boolean | (() => boolean),
  val?: number | string | boolean,
): [ConfigStateType, Dispatch<SetStateAction<boolean>>] {
  const [value, setValue] = useState<boolean>(initialState);
  const stateRef = useRef<ConfigStateType>();
  if (!stateRef.current) {
    stateRef.current = {
      name: `${StateNamePrefix}${StateNameId++}`,
      active: value,
      value: val,
    };
  } else {
    stateRef.current.active = value;
    stateRef.current.value = val;
  }
  return [stateRef.current, setValue];
}

export { useFluidState };
