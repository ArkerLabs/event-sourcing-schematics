import { Path } from '@angular-devkit/core';
import { ElementType } from '../utils';

export interface CommandOptions {
  /**
   * The name of the command.
   */
  name: string;

  /**
   * The path to create the command.
   */
  path?: string | Path;

  /**
   * The name of the module to insert the command.
   */
  module: string;

  /**
   * Directive to insert declaration in module.
   */
  skipImport?: boolean;

  /**
   * Metadata name affected by declaration insertion.
   */
  metadata?: string;

  /**
   * The type associated with the file. ex: foo.command.ts
   */
  fileType?: string;

  /**
   * Metadata name affected by declaration insertion.
   */
  elementType?: ElementType;

  /**
   * The source root path
   */
  sourceRoot?: string;

  /**
   * Specifies if a spec file is generated.
   */
  spec?: boolean;
}
