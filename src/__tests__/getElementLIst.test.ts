import { getElementList } from "../getElementList";
import { getSourceFile } from "../util";

const filePath = "./src/__tests__/testProj/example.ts";

describe("getFunctionList", () => {
  test("returns a list of functions in a TypeScript file", () => {
    const sourceFile = getSourceFile(filePath);
    const functionList = getElementList(sourceFile);
    expect(functionList[0].name).toEqual("foo");
    expect(functionList[0].children[0].name).toEqual("nest1");
    expect(functionList[1].name).toEqual("bar");
    expect(functionList[2].name).toEqual("MyClass");
    expect(functionList[2].children[0].name).toEqual("constructor");
    expect(functionList[2].children[1].name).toEqual("method1");
    expect(functionList[2].children[2].name).toEqual("method2");
    expect(functionList[3].name).toEqual("runCallback");
    expect(functionList[4].name).toEqual("runCallbackWork");
    expect(functionList[4].children[0]).toEqual(undefined);
  });
  test("returns a list of functions with anonymous functions", () => {
    const sourceFile = getSourceFile(filePath);
    const functionList = getElementList(sourceFile, {
      showAnonymousFunction: true,
    });
    expect(functionList[3].name).toEqual("anonymous");
    expect(functionList[3].children[0].name).toEqual("inAnonymous");
  });
});
