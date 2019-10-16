import { useContext, useRef } from "react";
import {
  StateContext,
  StateContextType,
  TransitionItem,
  ConfigurationContext,
} from "../Types";
import { useLog } from "../../Hooks";
import { LoggerLevel, StateMounted, StateUnmounted } from "../../Types";
import {
  SafeConfigType,
  ConfigStateType,
  ConfigType,
  validateConfig,
  mergeConfigs,
  ChildAnimationDirection,
  createConfig,
} from "../../Configuration";

/**
 *
 * @description Reads configuration elements from child elements and
 * provides configuration information and necessary context providers
 * @param children Configuration elements
 */
export const useConfiguration = (
  transitionItem: TransitionItem,
  configs: ConfigType | ConfigType[] | undefined,
  propStates?: ConfigStateType | Array<ConfigStateType>,
) => {
  // Previous property value
  const prevConfigs = useRef(configs);
  // Previous safe parsed value
  const prevConfiguration = useRef<SafeConfigType>();

  // Check for equality
  const isSameConfig = configs === prevConfigs.current;
  const shouldRefresh = !isSameConfig || !prevConfiguration.current;

  const logger = useLog(transitionItem.label, "confg");
  if (shouldRefresh) {
    logger(() => "Refresh configuration", LoggerLevel.Detailed);
  }

  // Use cache or update?
  let configuration: SafeConfigType;
  if (configs && (shouldRefresh || !prevConfiguration.current)) {
    validateConfig(configs);
    configuration = mergeConfigs(
      ...(configs ? (configs instanceof Array ? configs : [configs]) : []),
    );
  } else {
    configuration = prevConfiguration.current || mergeConfigs(createConfig({}));
  }

  // Update previous
  prevConfigs.current = configs;
  prevConfiguration.current = configuration;

  // Get states from properties
  const rs = propStates
    ? propStates instanceof Array
      ? propStates
      : [propStates]
    : [];

  const statesContext = useContext(StateContext);
  const configurationContext = useContext(ConfigurationContext);

  const resolvedStates = getResolvedStates(rs, statesContext);

  const getChildDirection = (): ChildAnimationDirection | undefined => {
    if (configuration.childAnimation.direction) {
      return configuration.childAnimation.direction;
    }
    if (configurationContext) {
      return configurationContext.getChildDirection();
    }
    return undefined;
  };

  return {
    configuration: {
      ...configuration,
      states: resolvedStates,
    },
    animationTypeContext: { getChildDirection },
    stateContext: { states: resolvedStates },
    resolvedChildDirection: getChildDirection(),
  };
};

function getResolvedStates(
  states: Array<ConfigStateType>,
  statesContext: StateContextType | null,
): ConfigStateType[] {
  const negatedStates = states
    .filter(p => p.negated !== undefined)
    .map(p => p.negated) as ConfigStateType[];

  return [
    ...states,
    ...negatedStates,
    ...(statesContext
      ? statesContext.states.filter(
          s => s.name !== StateMounted && s.name !== StateUnmounted,
        )
      : []),
  ];
}
