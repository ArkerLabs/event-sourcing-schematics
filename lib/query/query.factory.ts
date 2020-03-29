import { Path } from '@angular-devkit/core';
import {
  branchAndMerge,
  chain,
  mergeWith,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import {
  DeclarationOptions,
  ModuleDeclarator,
} from '../utils/module.declarator';
import { ModuleFinder } from '../utils/module.finder';
import { ElementType } from '../utils/name.parser';
import { mergeSourceRoot, modifyOptions } from '../utils/source-root.helpers';
import { generate } from '../utils/template.generator';
import { QueryOptions } from './query.schema';

export function main(options: QueryOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        modifyOptions(ElementType.query, options),
        mergeSourceRoot(options),
        mergeWith(generate(options)),
        modifyOptions(ElementType.queryHandler, options),
        mergeSourceRoot(options),
        mergeWith(generate(options)),
        addDeclarationToModule(options),
      ]),
    )(tree, context);
  };
}

function addDeclarationToModule(options: QueryOptions): Rule {
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
    tree.overwrite(
      modulePath,
      declarator.declare(content, options as DeclarationOptions, modulePath),
    );
    return tree;
  };
}
