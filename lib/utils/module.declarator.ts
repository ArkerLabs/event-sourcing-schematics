import { Path } from '@angular-devkit/core';
import { capitalize, classify } from '@angular-devkit/core/src/utils/strings';
import { ModuleImportDeclarator } from './module-import.declarator';
import { ModuleMetadataDeclarator } from './module-metadata.declarator';

export interface DeclarationOptions {
  metadata: string;
  fileType?: string;
  name: string;
  path: Path;
  module: Path;
  symbol?: string;
  staticOptions?: {
    name: string;
    value: Record<string, any>;
  };
}

export class ModuleDeclarator {
  constructor(
    private imports: ModuleImportDeclarator = new ModuleImportDeclarator(),
    private metadata: ModuleMetadataDeclarator = new ModuleMetadataDeclarator(),
  ) {}

  public declare(content: string, options: DeclarationOptions, modulePath: Path): string {
    options = this.computeSymbol(options);
    content = this.imports.declare(content, options, modulePath);
    content = this.metadata.declare(content, options);
    return content;
  }

  private computeSymbol(options: DeclarationOptions): DeclarationOptions {
    const target = Object.assign({}, options);
    if (options.fileType !== undefined) {
      target.symbol = classify(options.name).concat(capitalize(options.fileType));
    } else {
      target.symbol = classify(options.name);
    }
    return target;
  }
}
