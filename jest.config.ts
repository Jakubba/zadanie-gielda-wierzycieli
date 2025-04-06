import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.scss$": "jest-transform-stub",
  },
  moduleNameMapper: {
    "\\.scss$": require.resolve("jest-transform-stub"), // Tłumaczymy pliki .scss na mocka
  },
  transformIgnorePatterns: ["/node_modules/"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
};

export default config;
