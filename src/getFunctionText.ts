import * as ts from "typescript";
import { getElementList } from "./getElementList";

export function getFunctionText(name: string, sourceFile: ts.SourceFile) {
  const functionNode = getFunctionNodeByNme(name, sourceFile);
  const text = getFunctionTextByNode(functionNode, sourceFile);
  return text;
}

function getFunctionNodeByNme(name: string, sourceFile: ts.SourceFile) {
  const functionList = getElementList(sourceFile);
  const functionNode = functionList.find((functionNode) => {
    return functionNode.name === name;
  });
  if (!functionNode) {
    throw new Error(`Function ${name} not found`);
  }
  return functionNode.node;
}

function getFunctionTextByNode(node: ts.Node, sourceFile: ts.SourceFile) {
  if (ts.isFunctionDeclaration(node)) {
    return node.getText(sourceFile);
  } else if (ts.isMethodDeclaration(node)) {
    return node.getText(sourceFile);
  } else if (ts.isFunctionExpression(node)) {
    return node.parent.getText(sourceFile);
  } else if (ts.isArrowFunction(node)) {
    return node.parent.getText(sourceFile);
  } else if (ts.isConstructorDeclaration(node)) {
    return node.parent.getText(sourceFile);
  } else {
    return undefined;
  }
}
