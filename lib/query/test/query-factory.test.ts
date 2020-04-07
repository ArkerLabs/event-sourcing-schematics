import { Path } from '@angular-devkit/core';
import { classify } from '@angular-devkit/core/src/utils/strings';
import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';

import { QueryOptions } from '../query.schema';
import {
  expectCreatedQueryAndHandler,
  expectCreatedQueryAndHandlerInPaths,
  expectCreatedQueryAndHandlerWithSpec,
  expectNestProvidersArrayModuleToBeUpdatedInAppModule,
  expectNestProvidersArrayModuleToBeUpdatedInCustomModule,
} from './query-test.utils';

describe('Query Factory', () => {
  const runner: SchematicTestRunner = new SchematicTestRunner('.', path.join(process.cwd(), 'lib/collection.json'));
  it('should create a query and its handler but not the spec in the root path when called with name and without module and spec=false', () => {
    const options: QueryOptions = {
      name: 'foo',
      skipImport: true,
      spec: false,
      module: '' as Path,
    };

    const tree: UnitTestTree = runner.runSchematic('query', options);

    expectCreatedQueryAndHandler(tree, 'foo', 'foo', 'Foo', options.module);
  });

  it('should create a query, its handler and the spec file in the root path when called with name and without module and spec=true', () => {
    const options: QueryOptions = {
      name: 'foo',
      skipImport: true,
      spec: true,
      module: '' as Path,
    };

    const tree: UnitTestTree = runner.runSchematic('query', options);

    expectCreatedQueryAndHandlerWithSpec(tree, 'foo', options.module, 'foo', 'Foo');
  });

  it('should should throw when called without name and module', () => {
    const options: any = {};

    expect(() => runner.runSchematic('query', options, Tree.empty())).toThrow();
  });

  it('should should throw when called without module', () => {
    const options: any = {
      name: 'hey',
    };

    expect(() => runner.runSchematic('query', options, Tree.empty())).toThrow();
  });

  it('should throw when name is not a string', () => {
    const options: any = {
      name: 1,
    };

    expect(() => runner.runSchematic('query', options, Tree.empty())).toThrow();
  });

  it('should manage declaration in app module', () => {
    const app: any = {
      name: '',
    };
    const nestTree: UnitTestTree = runner.runExternalSchematic('@nestjs/schematics', 'application', app);

    const options: QueryOptions = {
      name: 'foo',
      spec: false,
      module: '' as Path,
    };

    const tree: UnitTestTree = runner.runSchematic('query', options, nestTree);

    expectCreatedQueryAndHandlerInPaths(
      tree,
      'foo',
      '/src/queries/impl/foo.query.ts',
      '/src/queries/handlers/foo.handler.ts',
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

    const options: QueryOptions = {
      name: 'foo',
      spec: false,
      module: 'users' as Path,
    };

    const tree: UnitTestTree = runner.runSchematic('query', options, moduleTree);

    expectCreatedQueryAndHandlerInPaths(
      tree,
      'foo',
      '/src/users/queries/impl/foo.query.ts',
      '/src/users/queries/handlers/foo.handler.ts',
      options.module,
    );
    expectNestProvidersArrayModuleToBeUpdatedInCustomModule(tree, classify('foo'), moduleOptions.name);
  });
});
