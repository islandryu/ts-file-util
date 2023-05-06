import * as ts from "typescript";
import { getElementList } from "./getElementList";

/**
 * getFunctionText is a function that takes a function name and a TypeScript source file,
 * and returns the text of the function from the source file.
 *
 * @param name - The name of the function to be retrieved.
 * @param sourceFile - The TypeScript source file where the function is located.
 *
 * @returns The text of the function, if found. If not found, an error will be thrown.
 */
export function getFunctionText(name: string, sourceFile: ts.SourceFile) {
  const functionNode = getFunctionNodeByNme(name, sourceFile);
  const text = getFunctionTextByNode(functionNode, sourceFile);
  return text;
}

/**
 * getFunctionNodeByName is a helper function that retrieves a TypeScript node corresponding
 * to a function with a given name from a TypeScript source file.
 *
 * @param name - The name of the function to be retrieved.
 * @param sourceFile - The TypeScript source file where the function is located.
 *
 * @returns The TypeScript node of the function, if found. If not found, an error will be thrown.
 */
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

/**
 * getFunctionTextByNode is a helper function that retrieves the text of a function,
 * given a TypeScript node and the source file where the node is located.
 *
 * @param node - The TypeScript node of the function.
 * @param sourceFile - The TypeScript source file where the function is located.
 *
 * @returns The text of the function, if the node corresponds to a function. If not, it returns undefined.
 */
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
