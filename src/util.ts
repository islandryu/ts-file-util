import fs from "fs";
import * as ts from "typescript";

export function getSourceFile(filePath: string) {
  const sourceCode = fs.readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest
  );
  return sourceFile;
}

export function getRootDir(filePath: string) {
  const dirPath = filePath.split("/");
  while (true) {
    if (dirPath.length === 0) throw new Error(".tsconfig not found");
    dirPath.pop();
    const root = dirPath.join("/");
    const tsconfigPath = ts.findConfigFile(root, ts.sys.fileExists);
    if (tsconfigPath) return { root, tsconfig: tsconfigPath };
  }
}

export function getTsconfig(filePath: string) {
  const { tsconfig } = getRootDir(filePath);
  const config = ts.readConfigFile(tsconfig, ts.sys.readFile).config;
  return config;
}
