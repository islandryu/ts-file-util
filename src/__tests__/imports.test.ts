import * as ts from "typescript";
import {
  findImports,
  findImportedByTsFiles,
  findImportingTsFiles,
} from "../imports";
import { getSourceFile } from "../util";

const filePath = "./src/__tests__/testProj/example.ts";

describe("findImports", () => {
  it("should find imported module names", () => {
    const sourceFile = getSourceFile(filePath);

    const imports = findImports(sourceFile);

    expect(imports).toEqual(["react", "./imported"]);
  });
});

describe("findReferencingTsFiles", () => {
  it("should find referencing ts files", () => {
    const referencedTsFiles = findImportingTsFiles(filePath);

    expect(referencedTsFiles).toEqual([
      "src\\__tests__\\testProj\\imported.ts",
    ]);
  });
});

describe("findReferencedTsFiles", () => {
  it("should find referenced ts files", () => {
    const referencedTsFiles = findImportedByTsFiles(
      "./src/__tests__/testProj/imported.ts"
    );

    expect(referencedTsFiles).toEqual([
      "src\\__tests__\\testProj\\example.ts",
      "src\\__tests__\\testProj\\src\\main.ts",
    ]);
  });
});
