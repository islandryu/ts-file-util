import { getFunctionText } from "../getFunctionText";
import { getSourceFile } from "../util";

describe("getFunctionText", () => {
  test("returns a function text from a TypeScript file", () => {
    const filePath = "./src/__tests__/example.ts";
    const sourceFile = getSourceFile(filePath);
    const text = getFunctionText("foo", sourceFile);
    expect(text?.split("")).toEqual(
      `function foo(a: string, b: string) {,
      const nest1 = () => {,
        return a + b;,
      };,
      return a + b;,
    }`.split("")
    );
  });
  test("returns a method text from a TypeScript file", () => {
    const filePath = "./src/__tests__/example.ts";
    const sourceFile = getSourceFile(filePath);
    const text = getFunctionText("runCallback", sourceFile);
    expect(text).toEqual(
      `runCallback = (callback: () => void) => {
  callback();
}`
    );
  });
});
