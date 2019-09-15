import { LoggerLevel, UseLoggerFunction, LoggerFunc } from "../Types";
import { CurrentLogLevel } from "../config";

export const useLog = (
  label: string | undefined,
  owner: string
): UseLoggerFunction => {
  return (msgFunc: LoggerFunc, level?: LoggerLevel) =>
    log(label, owner, msgFunc(), level);
};

export const getLogLevel = () => CurrentLogLevel;

export const log = (
  label: string | undefined,
  owner: string,
  msg: string | undefined,
  level: LoggerLevel = LoggerLevel.Info
) => {
  if (level <= CurrentLogLevel) {
    if (!msg) return;
    const timestamp = new Date();
    console.log(
      owner +
        " " +
        (getFormattedTime(timestamp) + " " + label || "undefined") +
        ":",
      msg
    );
  }
};

export const getFormattedTimeNum = (t: number) => {
  const timestamp = new Date(t);
  return getFormattedTime(timestamp);
};

export const getFormattedTime = (timestamp: Date) => {
  return "[" + timestamp.getSeconds() + ":" + timestamp.getMilliseconds() + "]";
};
