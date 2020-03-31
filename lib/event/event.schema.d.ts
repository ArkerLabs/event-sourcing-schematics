import { Path } from '@angular-devkit/core';

export interface EventOptions {
  /**
   * The name of the command.
   */
  name: string;

  /**
   * The path to insert the command declaration.
   */
  module: string | Path;
  /*
   *
   * The path to create the command.
   */
  path?: string | Path;

  /**
   * Directive to insert declaration in module.
   */
  createHandler: boolean;
  /**
   * Directive to insert declaration in module.
   */
  createUpdater: boolean;
  /**
   * Directive to insert declaration in module.
   */
  skipImport?: boolean;
  /**
   * Metadata name affected by declaration insertion.
   */
  metadata?: string;
  fileType?: string;

  elementType?: string;
  /**
   * The source root path
   */
  sourceRoot?: string;
  /**
   * Specifies if a spec file is generated.
   */
  spec?: boolean;
}
