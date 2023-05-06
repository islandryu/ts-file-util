#!/usr/bin/env node

import { program } from "commander";
import { getElementList, getTreeFromFunctionList } from "./getElementList";
import treeify from "treeify";
import { getSourceFile } from "./util";
import { getFunctionText } from "./getFunctionText";
import { findImportedByTsFiles, findImportingTsFiles } from "./imports";

program
  .command("element <path>")
  .alias("e")
  .description("get element list tree from a TypeScript file")
  .action((path) => {
    const sourceFile = getSourceFile(path);
    const tree = getTreeFromFunctionList(getElementList(sourceFile));
    console.log(treeify.asTree(tree, true, true));
  });

program
  .command("function-text <name> <path>")
  .alias("f")
  .description("get function text from a TypeScript file")
  .action((name, path) => {
    const sourceFile = getSourceFile(path);
    const text = getFunctionText(name, sourceFile);
    console.log(text);
  });

program
  .command("import <path>")
  .alias("i")
  .description("importing a TypeScript files")
  .action((path) => {
    const tsFiles = findImportingTsFiles(path);
    console.log(tsFiles);
  });

program
  .command("imported <path>")
  .description("imported a TypeScript files")
  .action((path) => {
    const tsFiles = findImportedByTsFiles(path);
    console.log(tsFiles);
  });

program.parse(process.argv);
