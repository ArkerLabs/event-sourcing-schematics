import { join, Path, strings } from '@angular-devkit/core';
import { apply, filter, move, noop, SchematicContext, template, url } from '@angular-devkit/schematics';

import { ElementType } from './element-type.enum';
import { pluralizeString, singularize } from './singularize-string';

export function generate<
  T extends {
    name: string;

    module: string | Path;

    path?: string | Path;

    skipImport?: boolean;

    metadata?: string;

    fileType?: string;

    elementType?: string;

    sourceRoot?: string;
    createHandler?: boolean;
    createUpdater?: boolean;
    spec?: boolean;
  }
>(options: T) {
  return (context: SchematicContext) =>
    apply(url(join('./files' as Path, options.fileType)), [
      options.spec === true ? noop() : filter((path) => !path.endsWith('.spec.ts')),
      options.createHandler === true
        ? noop()
        : filter((path) => {
            if (options.elementType === ElementType.eventHandler) {
              return !path.includes(`handler`);
            }

            return true;
          }),
      options.createUpdater === true
        ? noop()
        : filter((path) => !path.endsWith('.updater.ts') && !path.endsWith('.updater.spec.ts')),
      template({
        ...strings,
        ...options,
        singularize,
        pluralizeString,
      }),
      move(options.path),
    ])(context);
}
