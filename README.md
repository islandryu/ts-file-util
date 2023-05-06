# TypeScript File Utilities (ts-file-util)

`ts-file-util` is a utility package for TypeScript projects that provides several helper functions to retrieve function information, import information, and more from TypeScript source files.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install `ts-file-util`.

```bash
npm install ts-file-util
```

## function Usage

```typescript
import {
  getElementList,
  getFunctionText,
  findImports,
  findImportedByTsFiles,
  findImportingTsFiles,
} from "ts-file-util";
```

### getElementList

The `getElementList` function retrieves a list of all functions within a TypeScript source file, along with their child functions.

```typescript
import { getElementList } from "ts-file-util";

// Assume `sourceFile` is a ts.SourceFile instance
const functionList = getElementList(sourceFile);
```

### getFunctionText

The `getFunctionText` function retrieves the text of a specified function from a TypeScript source file.

```typescript
import { getFunctionText } from "ts-file-util";

// Assume `sourceFile` is a ts.SourceFile instance
const functionText = getFunctionText("functionName", sourceFile);
```

### findImports

The `findImports` function retrieves a list of all imported modules in a TypeScript source file.

```typescript
import { findImports } from "ts-file-util";

// Assume `sourceFile` is a ts.SourceFile instance
const imports = findImports(sourceFile);
```

### findImportedByTsFiles

The `findImportedByTsFiles` function retrieves a list of all TypeScript files that import a specified file.

```typescript
import { findImportedByTsFiles } from "ts-file-util";

const importingFiles = findImportedByTsFiles("targetFilePath");
```

### findImportingTsFiles

The `findImportingTsFiles` function retrieves a list of all TypeScript files that a specified file imports.

```typescript
import { findImportingTsFiles } from "ts-file-util";

const importedFiles = findImportingTsFiles("filePath");
```

### CLI Usage

The `ts-file-util` package provides a CLI with several commands.

#### element

The `element` command retrieves a list of all functions within a TypeScript source file, along with their child functions, and prints them in a tree structure.

```bash
ts-file-util element path/to/file.ts
```

#### function-text

The `function-text` command retrieves the text of a specified function from a TypeScript source file.

```bash
ts-file-util function-text functionName path/to/file.ts
```

#### import

The `import` command retrieves a list of all TypeScript files that a specified file imports.

```bash
ts-file-util import path/to/file.ts
```

#### imported

The `imported` command retrieves a list of all TypeScript files that import a specified file.

```bash
ts-file-util imported path/to/file.ts
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

## [MIT](https://choosealicense.com/licenses/mit/)
