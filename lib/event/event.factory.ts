import { Path } from '@angular-devkit/core';
import { branchAndMerge, chain, mergeWith, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { ElementType } from '../utils/element-type.enum';
import { DeclarationOptions, ModuleDeclarator } from '../utils/module.declarator';
import { ModuleFinder } from '../utils/module.finder';
import { mergeSourceRoot, modifyOptions } from '../utils/source-root.helpers';
import { generate } from '../utils/template.generator';
import { EventOptions } from './event.schema';

export function main(options: EventOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        modifyOptions(ElementType.event, options),
        mergeSourceRoot(options),
        mergeWith(generate(options)),
        modifyOptions(ElementType.eventHandler, options),
        mergeSourceRoot(options),
        mergeWith(generate(options)),
        addDeclarationToModule(options),
        modifyOptions(ElementType.eventUpdater, options),
        mergeSourceRoot(options),
        mergeWith(generate(options)),
        addDeclarationToModule(options),
      ]),
    )(tree, context);
  };
}

function addDeclarationToModule(options: EventOptions): Rule {
  return (tree: Tree) => {
    if (options.skipImport !== undefined && options.skipImport) {
      return tree;
    }

    if(options.elementType === ElementType.eventUpdater.toString() && !options.createUpdater){
      return tree;
    }

    if( options.elementType === ElementType.eventHandler.toString() && !options.createHandler){
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
