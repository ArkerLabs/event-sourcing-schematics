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
import { CommandOptions } from './command.schema';

export const ELEMENT_METADATA = 'providers';
export const COMMAND_TYPE = 'command';
export const HANDLER_TYPE = 'handler';

export function main(options: CommandOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        modifyOptions(ElementType.command, options),
        mergeSourceRoot(options),
        mergeWith(generate(options)),
        modifyOptions(ElementType.commandHandler, options),
        mergeSourceRoot(options),
        mergeWith(generate(options)),
        addDeclarationToModule(options),
      ]),
    )(tree, context);
  };
}

function addDeclarationToModule(options: CommandOptions): Rule {
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
