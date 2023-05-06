import { getRootDir } from "../util";

it("should return the correct root directory and tsconfig path for a top-level file", () => {
  const rootDir = getRootDir("./src/__tests__/testProj/example.ts");
  expect(rootDir).toEqual({
    root: "./src/__tests__/testProj",
    tsconfigPath: "./src/__tests__/testProj/tsconfig.json",
  });
});

it("should return the correct root directory and tsconfig path for a nested file", () => {
  const rootDir = getRootDir("./src/__tests__/testProj/src/main.ts");
  expect(rootDir).toEqual({
    root: "./src/__tests__/testProj",
    tsconfigPath: "./src/__tests__/testProj/tsconfig.json",
  });
});
