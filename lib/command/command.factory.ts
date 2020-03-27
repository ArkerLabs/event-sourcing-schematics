import { Path, strings } from '@angular-devkit/core';
import { apply, branchAndMerge, chain, mergeWith, move, Rule, SchematicContext, template, Tree, url } from '@angular-devkit/schematics';

import { DeclarationOptions, ModuleDeclarator } from '../utils/module.declarator';
import { ModuleFinder } from '../utils/module.finder';
import { ElementType } from '../utils/name.parser';
import { mergeSourceRoot, modifyOptions } from '../utils/source-root.helpers';
import { CommandOptions } from './command.schema';
import { generate } from '../utils/template.generator';

export const ELEMENT_METADATA = 'providers';
export const COMMAND_TYPE = 'command';
export const HANDLER_TYPE = 'handler';

export function main(options: CommandOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        modifyOptions(ElementType.command, options),
        mergeSourceRoot(options),
        mergeWith(generate(ElementType.command, options)),
        modifyOptions(ElementType.commandHandler, options),
        mergeSourceRoot(options),
        mergeWith(generate(ElementType.commandHandler, options)),
        addDeclarationToModule(options),
      ]),
    )(tree, context);
  };
}

function generateCommand(options: CommandOptions) {
  return (context: SchematicContext) =>
    apply(url('../../../src/lib/command/files/command' as Path), [
      template({
        ...strings,
        ...options,
      }),
      move(options.path),
    ])(context);
}

function generateCommandHandler(options: CommandOptions) {
  return (context: SchematicContext) =>
    apply(url('../../../src/lib/command/files/handler' as Path), [
      template({
        ...strings,
        ...options,
      }),
      move(options.path),
    ])(context);
}

function addDeclarationToModule(options: CommandOptions): Rule {
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
