import { Path } from '@angular-devkit/core';
import { classify } from '@angular-devkit/core/src/utils/strings';
import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

import { CommandOptions } from '../command.schema';
import {
  expectCreatedCommandAndHandler,
  expectCreatedCommandAndHandlerInPaths,
  expectCreatedCommandAndHandlerWithSpec,
  expectNestProvidersArrayModuleToBeUpdatedInAppModule,
  expectNestProvidersArrayModuleToBeUpdatedInCustomModule,
} from './command-tests.utils';

describe('Command Factory', () => {
  const runner: SchematicTestRunner = new SchematicTestRunner('.', path.join(process.cwd(), 'lib/collection.json'));
  it('should create a command and its handler but not the spec in the root path when called with name and without module and spec=false', () => {
    const options: CommandOptions = {
      name: 'foo',
      skipImport: true,
      spec: false,
      module: '' as Path,
    };

    const tree: UnitTestTree = runner.runSchematic('command', options);

    expectCreatedCommandAndHandler(tree, 'foo', 'foo', 'Foo', '');
  });

  it('should create a command, its handler and the spec file in the root path when called with name and without module and spec=true', () => {
    const options: CommandOptions = {
      name: 'foo',
      skipImport: true,
      spec: true,
      module: '' as Path,
    };

    const tree: UnitTestTree = runner.runSchematic('command', options);

    expectCreatedCommandAndHandlerWithSpec(tree, 'foo', 'foo', 'Foo', '');
  });

  it('should should throw when called without name and module', () => {
    const options: any = {};

    expect(() => runner.runSchematic('command', options, Tree.empty())).toThrow();
  });

  it('should should throw when called without module', () => {
    const options: any = {
      name: 'hey',
    };

    expect(() => runner.runSchematic('command', options, Tree.empty())).toThrow();
  });

  it('should throw when name is not a string', () => {
    const options: any = {
      name: 1,
    };

    expect(() => runner.runSchematic('command', options, Tree.empty())).toThrow();
  });

  it('should manage declaration in app module', () => {
    const app: any = {
      name: '',
    };
    const nestTree: UnitTestTree = runner.runExternalSchematic('@nestjs/schematics', 'application', app);

    const options: CommandOptions = {
      name: 'foo',
      spec: false,
      module: '' as Path,
    };

    const tree: UnitTestTree = runner.runSchematic('command', options, nestTree);

    expectCreatedCommandAndHandlerInPaths(
      tree,
      'foo',
      '/src/commands/impl/foo.command.ts',
      '/src/commands/handlers/foo.handler.ts',
      options.module,
    );
    expectNestProvidersArrayModuleToBeUpdatedInAppModule(tree, classify('foo'));
  });

  it('should manage declaration in users module', async () => {
    const moduleOptions = {
      name: 'users',
    };

    const app: any = {
      name: '',
    };
    const nestTree: UnitTestTree = runner.runExternalSchematic('@nestjs/schematics', 'application', app);
    const moduleTree = runner.runExternalSchematic('@nestjs/schematics', 'module', moduleOptions, nestTree);

    const options: CommandOptions = {
      name: 'foo',
      spec: false,
      module: 'users' as Path,
    };

    const tree: UnitTestTree = runner.runSchematic('command', options, moduleTree);

    expectCreatedCommandAndHandlerInPaths(
      tree,
      'foo',
      '/src/users/commands/impl/foo.command.ts',
      '/src/users/commands/handlers/foo.handler.ts',
      moduleOptions.name,
    );
    expectNestProvidersArrayModuleToBeUpdatedInCustomModule(tree, classify('foo'), moduleOptions.name);
  });
});
