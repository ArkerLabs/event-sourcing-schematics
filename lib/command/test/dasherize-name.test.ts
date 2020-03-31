import { Path } from '@angular-devkit/core';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { CommandOptions } from '../command.schema';
import { expectCreatedCommandAndHandler } from './command-tests.utils';

describe('Dasherizing name', () => {
  const runner: SchematicTestRunner = new SchematicTestRunner('.', path.join(process.cwd(), 'lib/collection.json'));
  const expectedDasherized = 'foo-bar';
  const expectedClassified = 'FooBar';

  it('should manage name to dasherize when using camelCase', () => {
    const options: CommandOptions = {
      name: 'fooBar',
      module: '' as Path,
      spec: false,
    };

    const tree: UnitTestTree = runner.runSchematic('command', options);

    expectCreatedCommandAndHandler(tree, 'fooBar', expectedDasherized, expectedClassified);
  });

  it('should manage name to dasherize when using PascalCase', () => {
    const options: CommandOptions = {
      name: 'FooBar',
      module: '' as Path,
      spec: false,
    };

    const tree: UnitTestTree = runner.runSchematic('command', options);

    expectCreatedCommandAndHandler(tree, 'FooBar', expectedDasherized, expectedClassified);
  });

  it('should manage name to dasherize when using kebab-case', () => {
    const options: CommandOptions = {
      name: 'foo_bar',
      module: '' as Path,
      spec: false,
    };

    const tree: UnitTestTree = runner.runSchematic('command', options);

    expectCreatedCommandAndHandler(tree, 'foo-bar', expectedDasherized, expectedClassified);
  });

  it('should manage name to dasherize when using snake_case', () => {
    const options: CommandOptions = {
      name: 'foo_bar',
      module: '' as Path,
      spec: false,
    };

    const tree: UnitTestTree = runner.runSchematic('command', options);

    expectCreatedCommandAndHandler(tree, 'foo_bar', expectedDasherized, expectedClassified);
  });

  it('should manage name to dasherize when using two words', () => {
    const options: CommandOptions = {
      name: 'foo bar',
      module: '' as Path,
      spec: false,
    };

    const tree: UnitTestTree = runner.runSchematic('command', options);

    expectCreatedCommandAndHandler(tree, 'foo bar', expectedDasherized, expectedClassified);
  });
});
