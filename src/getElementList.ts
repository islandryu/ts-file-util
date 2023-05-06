import { TreeObject } from "treeify";
import * as ts from "typescript";
import { getSourceFile } from "./util";

type FunctionList = { node: ts.Node; name: string; children: FunctionList[] };
type Option = {
  showAnonymousFunction: boolean;
};

/**
 * getElementList is a function that parses a TypeScript source file and returns a list of objects
 * representing the hierarchy of functions, methods, classes, function expressions, arrow functions, and constructors found in the file.
 *
 * @param sourceFile - The TypeScript source file to be parsed.
 * @param option - An optional object with configuration options.
 *    - showAnonymousFunction: If true, the function will include anonymous function expressions and arrow functions in the returned list. If false, these will be excluded.
 *
 * @returns A list of FunctionList objects. Each object represents a function, method, class, function expression, arrow function, or constructor found in the source file.
 *    - node: The TypeScript node corresponding to the function, method, class, function expression, arrow function, or constructor.
 *    - name: The name of the function, method, class, function expression, arrow function, or constructor. For anonymous functions, this will be "anonymous" if the showAnonymousFunction option is true.
 *    - children: A list of FunctionList objects representing any functions, methods, classes, function expressions, arrow functions, or constructors that are nested within the current node.
 *
 * The function uses a recursive approach to visit each node in the source file's abstract syntax tree (AST), and checks if the node corresponds to a function, method, class, function expression, arrow function, or constructor. If it does, an object with information about the node is created and added to the list.
 */
export function getElementList(
  sourceFile: ts.SourceFile,
  option?: Option
): FunctionList[] {
  function visit(node: ts.Node): FunctionList | FunctionList[] {
    let result: FunctionList | undefined = undefined;
    const children: FunctionList[] = [];
    if (
      ts.isFunctionDeclaration(node) ||
      ts.isMethodDeclaration(node) ||
      ts.isClassDeclaration(node)
    ) {
      const name = node.name?.getText(sourceFile);
      if (name) {
        result = {
          node: node,
          name: name,
          children: [],
        };
      }
    } else if (ts.isFunctionExpression(node) || ts.isArrowFunction(node)) {
      let name: string | undefined = undefined;
      if (ts.isVariableDeclaration(node.parent)) {
        name = node.parent.name.getText(sourceFile);
      }
      if (!name && !option?.showAnonymousFunction) {
        return [];
      }
      name = name || "anonymous";
      if (name) {
        result = {
          node: node,
          name,
          children: [],
        };
      }
    } else if (ts.isConstructorDeclaration(node)) {
      result = {
        node: node,
        name: "constructor",
        children: [],
      };
    }
    ts.forEachChild(node, (childNode) => {
      // @ts-ignore
      childNode.parent = node;
      const childResult = visit(childNode);
      if (childResult) {
        if (Array.isArray(childResult)) {
          children.push(...childResult);
          return;
        }
        children.push(childResult);
      }
    });

    if (result) {
      result.children = children;
      return result;
    } else {
      return children;
    }
  }

  const result = visit(sourceFile);
  if (Array.isArray(result)) {
    return result;
  } else if (result === undefined) {
    return [];
  } else {
    return [result];
  }
}

export function getTreeFromFunctionList(functionList: FunctionList[]) {
  const tree: TreeObject = {};
  functionList.forEach((functionInfo) => {
    const children = functionInfo.children.reduce((acc, val) => {
      return { ...acc, [val.name]: getTreeFromFunctionList([val]) };
    }, {});
    tree[functionInfo.name] = children;
  });
  return tree;
}
