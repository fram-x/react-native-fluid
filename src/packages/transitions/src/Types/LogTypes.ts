export enum LoggerLevel {
  None,
  Always,
  Info,
  Verbose,
  Detailed
}

export type LoggerFunc = () => string | undefined;
export type UseLoggerFunction = (
  msgFunc: LoggerFunc,
  level?: LoggerLevel
) => void;
