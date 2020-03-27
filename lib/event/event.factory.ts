import { Path, strings } from '@angular-devkit/core';
import { apply, branchAndMerge, chain, mergeWith, move, Rule, SchematicContext, template, Tree, url } from '@angular-devkit/schematics';
import { DeclarationOptions, ModuleDeclarator } from '../utils/module.declarator';
import { ModuleFinder } from '../utils/module.finder';
import { ElementType } from '../utils/name.parser';
import { mergeSourceRoot, modifyOptions } from '../utils/source-root.helpers';
import { EventOptions } from './event.schema';





export function main(options: EventOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        modifyOptions(ElementType.event, options),
        mergeSourceRoot(options),
        mergeWith(generateEvent(options)),
        modifyOptions(ElementType.eventHandler, options),
        mergeSourceRoot(options),
        mergeWith(generateEventHandler(options)),
        addDeclarationToModule(options),
        modifyOptions(ElementType.eventUpdater, options),
        mergeSourceRoot(options),
        mergeWith(generateEventUpdater(options)),
        addDeclarationToModule(options),
      ]),
    )(tree, context);
  };
}

function generateEvent(options: EventOptions) {
  return (context: SchematicContext) =>
    apply(url('../../../src/lib/event/files/event' as Path), [
      template({
        ...strings,
        ...options,
      }),
      move(options.path),
    ])(context);
}

function generateEventHandler(options: EventOptions) {
  return (context: SchematicContext) =>
    apply(url('../../../src/lib/event/files/handler' as Path), [
      template({
        ...strings,
        ...options,
      }),
      move(options.path),
    ])(context);
}


function generateEventUpdater(options: EventOptions) {
  return (context: SchematicContext) =>
    apply(url('../../../src/lib/event/files/updater' as Path), [
      template({
        ...strings,
        ...options,
      }),
      move(options.path),
    ])(context);
}

function addDeclarationToModule(options: EventOptions): Rule {
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
