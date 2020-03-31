import { branchAndMerge, chain, mergeWith, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addDeclarationToModule } from '../utils/module.updater';
import { mergeSourceRoot, modifyOptions } from '../utils/source-root.helpers';
import { generate } from '../utils/template.generator';
import { CommandOptions } from './command.schema';
import { ElementType } from '../utils/element-type.enum';

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
