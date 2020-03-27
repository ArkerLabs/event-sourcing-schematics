import { Path, strings } from "@angular-devkit/core";

import { SchematicContext, move, apply, url, template } from "@angular-devkit/schematics";
import { ElementType } from "./name.parser";


export function generate<
T extends {
  name: string;

  module: string | Path;

  path?: string | Path;

  skipImport?: boolean;

  metadata?: string;

  type?: string;

  sourceRoot?: string;

  spec?: boolean;

  flat?: boolean;
}
>(type: ElementType, options: T) {
    console.log("./files/"+type);
    return (context: SchematicContext) =>
      apply(url('./files/' + type as Path), [
        template({
          ...strings,
          ...options,
        }),
        move(options.path),
      ])(context);
  }
  