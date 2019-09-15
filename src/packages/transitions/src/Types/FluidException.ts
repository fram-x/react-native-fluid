export const fluidException = (msg: string) =>
  new Error("Fluid Transitions: " + msg);

export const fluidInternalException = (msg: string) =>
  new Error(
    "Fluid Transitions: " +
      msg +
      "\r" +
      "This is an internal error - please submit a bug report."
  );
