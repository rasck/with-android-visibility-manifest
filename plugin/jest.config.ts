import type { Config } from "@jest/types";
// Sync object
const config: Config.InitialOptions = {
  preset: "ts-jest",
  //testEnvironment: "node",
  verbose: true,
  globals: {
    "ts-jest": {
      tsconfig: { noImplicitAny: false },
    },
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
export default config;
