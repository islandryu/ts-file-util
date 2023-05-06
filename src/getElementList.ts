import { TreeObject } from "treeify";
import * as ts from "typescript";
import { getSourceFile } from "./util";

type FunctionList = { node: ts.Node; name: string; children: FunctionList[] };
type Option = {
  showAnonymousFunction: boolean;
};

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
