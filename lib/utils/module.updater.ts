import { Rule, Tree } from '@angular-devkit/schematics';
import { DeclarationOptions, ModuleDeclarator, ModuleFinder } from '.';
import { Path } from '@angular-devkit/core';

export function addDeclarationToModule<
  T extends {
    name: string;

    module: string | Path;

    path?: string | Path;

    skipImport?: boolean;

    metadata?: string;

    fileType?: string;

    elementType?: string;

    sourceRoot?: string;

    spec?: boolean;
  }
>(options: T): Rule {
  return (tree: Tree) => {
    if (options.skipImport !== undefined && options.skipImport) {
      return tree;
    }
    const modulePath: Path = new ModuleFinder(tree).find({
      name: options.name,
      path: options.path as Path,
    });

    if (!modulePath) {
      return tree;
    }
    const content = tree.read(modulePath).toString();
    const declarator: ModuleDeclarator = new ModuleDeclarator();
    tree.overwrite(modulePath, declarator.declare(content, options as DeclarationOptions, modulePath));
    return tree;
  };
}
