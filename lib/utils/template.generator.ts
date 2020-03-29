import { Path, strings } from '@angular-devkit/core';
import {
  apply,
  move,
  SchematicContext,
  template,
  url,
} from '@angular-devkit/schematics';

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

    spec?: boolean;

    flat?: boolean;
  }
>(options: T) {
  return (context: SchematicContext) =>
    apply(url(('./files/' + options.fileType) as Path), [
      template({
        ...strings,
        ...options,
      }),
      move(options.path),
    ])(context);
}
