import { normalize, Path } from '@angular-devkit/core';
import { DeclarationOptions } from './module.declarator';
import { PathSolver } from './path.solver';

export class ModuleImportDeclarator {
  constructor(private solver: PathSolver = new PathSolver()) {}

  public declare(content: string, options: DeclarationOptions, modulePath: Path): string {
    const toInsert = this.buildLineToInsert(options, modulePath);
    const contentLines = content.split('\n');
    const nonDuplicatedImports = contentLines.filter((val,i) => !val.includes(options.symbol));

    const finalImportIndex = this.findImportsEndpoint(nonDuplicatedImports);
    nonDuplicatedImports.splice(finalImportIndex + 1, 0, toInsert);
    return nonDuplicatedImports.join('\n');
  }

  private findImportsEndpoint(contentLines: string[]): number {
    const reversedContent = Array.from(contentLines).reverse();
    const reverseImports = reversedContent.filter(line =>
      line.match(/\} from ('|")/),
    );
    if (reverseImports.length <= 0) {
      return 0;
    }
    return contentLines.indexOf(reverseImports[0]);
  }

  private buildLineToInsert(options: DeclarationOptions, modulePath: Path): string {
    return `import { ${options.symbol} } from '${this.computeRelativePath(
      options,modulePath
    )}';`;
  }

  private computeRelativePath(options: DeclarationOptions, modulePath : Path): string {
    let importModulePath: Path;
    if (options.type !== undefined) {
      importModulePath = normalize(
        `/${options.path}/${options.name}.${options.type}`,
      );
    } else {
      importModulePath = normalize(`/${options.path}/${options.name}`);
    }
    return this.solver.relative(modulePath, importModulePath);
  }
}
