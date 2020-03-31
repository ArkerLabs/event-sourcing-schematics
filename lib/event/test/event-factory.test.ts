import { Path } from '@angular-devkit/core';
import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';
import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { EventOptions } from '../event.schema';
import {
  expectCreatedEvent,
  expectCreatedEventHandler,
  expectCreatedEventInPaths,
  expectCreatedEventUpdater,
  expectNotCreatedEventHandler,
  expectNotCreatedEventUpdater,
  expectNestProvidersArrayModuleToBeUpdatedInAppModule,
  expectNestProvidersArrayModuleToBeUpdatedWithEventsInCustomModule,
} from './event-tests.utils';

describe('Event Factory', () => {
  const runner: SchematicTestRunner = new SchematicTestRunner('.', path.join(process.cwd(), 'lib/collection.json'));
  it('should create an event, handler and updater with spec when specified', () => {
    const options: EventOptions = {
      name: 'foo',
      skipImport: true,
      spec: true,
      module: '' as Path,
      createHandler: true,
      createUpdater: true,
    };

    const tree: UnitTestTree = runner.runSchematic('event', options);

    expectCreatedEvent(tree, options.name, dasherize(options.name), classify(options.name));
    expectCreatedEventHandler(tree, options.name, true, dasherize(options.name), classify(options.name));
    expectCreatedEventUpdater(tree, options.name, true, dasherize(options.name), classify(options.name));
  });

  it('should create an event, handler and updater without spec when specified', () => {
    const options: EventOptions = {
      name: 'foo',
      skipImport: true,
      spec: false,
      module: '' as Path,
      createHandler: true,
      createUpdater: true,
    };

    const tree: UnitTestTree = runner.runSchematic('event', options);
    expectCreatedEvent(tree, options.name, dasherize(options.name), classify(options.name));
    expectCreatedEventHandler(tree, options.name, false, dasherize(options.name), classify(options.name));
    expectCreatedEventUpdater(tree, options.name, false, dasherize(options.name), classify(options.name));
  });

  it('should create an event and a handler when createHandler = true and createUpdater = false', () => {
    const options: EventOptions = {
      name: 'foo',
      skipImport: true,
      spec: true,
      module: '' as Path,
      createHandler: true,
      createUpdater: false,
    };

    const tree: UnitTestTree = runner.runSchematic('event', options);

    expectCreatedEvent(tree, options.name, dasherize(options.name), classify(options.name));
    expectCreatedEventHandler(tree, options.name, true, dasherize(options.name), classify(options.name));
    expectNotCreatedEventUpdater(tree, options.name);
  });

  it('should create an event when createHandler = false and createUpdater = false', () => {
    const options: EventOptions = {
      name: 'foo',
      skipImport: true,
      spec: true,
      module: '' as Path,
      createHandler: false,
      createUpdater: false,
    };

    const tree: UnitTestTree = runner.runSchematic('event', options);

    expectCreatedEvent(tree, options.name, dasherize(options.name), classify(options.name));
    expectNotCreatedEventHandler(tree, options.name);
    expectNotCreatedEventUpdater(tree, options.name);
  });

  it('should create an event and updater when createHandle = false and createUpdater = true', () => {
    const options: EventOptions = {
      name: 'foo',
      skipImport: true,
      spec: true,
      module: '' as Path,
      createHandler: false,
      createUpdater: true,
    };

    const tree: UnitTestTree = runner.runSchematic('event', options);

    expectCreatedEvent(tree, options.name, dasherize(options.name), classify(options.name));
    expectNotCreatedEventHandler(tree, options.name);
    expectCreatedEventUpdater(tree, options.name, true, dasherize(options.name), classify(options.name));
  });

  it('should throw when called without name and module', () => {
    const options: any = {};

    expect(() => runner.runSchematic('event', options, Tree.empty())).toThrow();
  });

  it('should throw when called without module', () => {
    const options: any = {
      name: 'hey',
    };

    expect(() => runner.runSchematic('event', options, Tree.empty())).toThrow();
  });

  it('should throw when name is not a string', () => {
    const options: any = {
      name: 1,
    };

    expect(() => runner.runSchematic('event', options, Tree.empty())).toThrow();
  });

  it('should manage declaration in app module', () => {
    const app: any = {
      name: '',
    };
    const nestTree: UnitTestTree = runner.runExternalSchematic('@nestjs/schematics', 'application', app);

    const options: EventOptions = {
      name: 'foo',
      spec: false,
      module: '' as Path,
      createHandler: true,
      createUpdater: true,
    };

    const tree: UnitTestTree = runner.runSchematic('event', options, nestTree);

    expectCreatedEventInPaths(
      tree,
      'foo',
      '/src/events/impl/foo.event.ts',
      '/src/events/handlers/foo.handler.ts',
      '/src/events/updaters/foo.updater.ts',
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

    const options: EventOptions = {
      name: 'foo',
      spec: false,
      module: 'users' as Path,
      createHandler: true,
      createUpdater: true,
    };

    const tree: UnitTestTree = runner.runSchematic('event', options, moduleTree);

    expectCreatedEventInPaths(
      tree,
      'foo',
      '/src/users/events/impl/foo.event.ts',
      '/src/users/events/handlers/foo.handler.ts',
      '/src/users/events/updaters/foo.updater.ts',
    );
    expectNestProvidersArrayModuleToBeUpdatedWithEventsInCustomModule(tree, classify('foo'), moduleOptions.name);
  });
});
