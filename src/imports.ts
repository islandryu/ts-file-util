import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import { getRootDir, getSourceFile } from "./util";

export function findImports(sourceFile: ts.SourceFile): string[] {
  const imports: string[] = [];

  ts.forEachChild(sourceFile, function visit(node) {
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier;
      if (ts.isStringLiteral(moduleSpecifier)) {
        imports.push(moduleSpecifier.text);
      }
    }
    ts.forEachChild(node, visit);
  });

  return imports;
}

export function findImportingTsFiles(filePath: string): string[] {
  const sourceFile = getSourceFile(filePath);

  const imports = findImports(sourceFile);

  const importedTsFiles: string[] = [];

  const extensions = [".ts", ".tsx"];

  imports.forEach((importPath) => {
    const isRelativePath = /^\.?\.\//;
    if (isRelativePath.test(importPath)) {
      const pathSegments = getPathSegments(filePath);
      pathSegments.pop();
      const importedFilePath = path.join(
        pathSegments.join(path.sep),
        importPath
      );
      for (const extension of extensions) {
        if (fs.existsSync(importedFilePath + extension)) {
          importedTsFiles.push(importedFilePath + extension);
          break;
        }
      }
    }
  });

  return importedTsFiles;
}

export function findImportedByTsFiles(targetFilePath: string): string[] {
  const targetFileName = path.basename(targetFilePath);
  const { root: rootDir } = getRootDir(targetFilePath);
  const files = getAllTsFilePathInDir(rootDir);
  const referencingTsFiles: string[] = [];

  files.forEach((file) => {
    const imports = findImportingTsFiles(file);

    imports.forEach((importPath) => {
      if (importPath === path.normalize(targetFilePath)) {
        referencingTsFiles.push(importPath);
      }
    });
  });

  return referencingTsFiles;
}

function getPathSegments(filePath: string) {
  const osFilePath = path.normalize(filePath);
  const segments = osFilePath.split(path.sep);
  return segments;
}

function getAllTsFilePathInDir(dir: string) {
  const files = fs.readdirSync(dir);

  let fileList: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(dir, files[i]);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      fileList = fileList.concat(getAllTsFilePathInDir(filePath));
    } else {
      fileList.push(filePath);
    }
  }

  return fileList.filter((file) => path.extname(file) === ".ts");
}
