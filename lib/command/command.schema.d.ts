import { Path } from '@angular-devkit/core';

export interface CommandOptions {
  /**
   * The name of the command.
   */
  name: string;
  /*
   * 
   * The path to create the command.
   */
  path?: string | Path;
  /**
   * The path to insert the command declaration.
   */
  module: Path;
  /**
   * Directive to insert declaration in module.
   */
  skipImport?: boolean;
  /**
   * Metadata name affected by declaration insertion.
   */
  metadata?: string;
  /**
   * Nest element type name
   */
  type?: string;

  /**
   * The source root path
   */
  sourceRoot?: string;
  /**
   * Specifies if a spec file is generated.
   */
  spec?: boolean;
  /**
   * Flag to indicate if a directory is created.
   */
  flat?: boolean;
}
