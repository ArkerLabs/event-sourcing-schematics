import { Path, strings } from '@angular-devkit/core';
import { apply, branchAndMerge, chain, mergeWith, move, Rule, SchematicContext, template, Tree, url } from '@angular-devkit/schematics';
import { DeclarationOptions, ModuleDeclarator } from '../utils/module.declarator';
import { ModuleFinder } from '../utils/module.finder';
import { ElementType } from '../utils/name.parser';
import { mergeSourceRoot, modifyOptions } from '../utils/source-root.helpers';
import { QueryOptions } from './query.schema';




export function main(options: QueryOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        modifyOptions(ElementType.query, options),
        mergeSourceRoot(options),
        mergeWith(generateQuery(options)),
        modifyOptions(ElementType.queryHandler, options),
        mergeSourceRoot(options),
        mergeWith(generateQueryHandler(options)),
        addDeclarationToModule(options),
      ]),
    )(tree, context);
  };
}

function generateQuery(options: QueryOptions) {
  return (context: SchematicContext) =>
    apply(url('../../../src/lib/query/files/query' as Path), [
      template({
        ...strings,
        ...options,
      }),
      move(options.path),
    ])(context);
}

function generateQueryHandler(options: QueryOptions) {
  return (context: SchematicContext) =>
    apply(url('../../../src/lib/query/files/handler' as Path), [
      template({
        ...strings,
        ...options,
      }),
      move(options.path),
    ])(context);
}

function addDeclarationToModule(options: QueryOptions): Rule {
  return (tree: Tree) => {
    if ((options.skipImport !== undefined && options.skipImport)) {
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
