import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { normalize } from 'path';

import { ElementType } from '../../utils/element-type.enum';
import { getStringLiteralTemplate } from '../../utils/test/template-string-literal.generator';

export function expectCreatedCommandAndHandler(
  tree: UnitTestTree,
  commandName: string,
  expectedDasherized: string,
  expectedClassified: string,
) {
  expect(
    tree.files.find((filename) => filename === `/commands/impl/${dasherize(commandName)}.command.ts`),
  ).toBeDefined();
  expect(
    tree.files.find((filename) => filename === `/commands/handlers/${dasherize(commandName)}.handler.ts`),
  ).toBeDefined();
  expect(tree.files.find((filename) => filename === '/commands/handlers/foo.handler.spec.ts')).not.toBeDefined();
  expect(tree.readContent(`/commands/impl/${dasherize(commandName)}.command.ts`)).toEqual(
    getStringLiteralTemplate(ElementType.command, {
      name: commandName,
      expectedDasherized: expectedDasherized,
      expectedClassified: expectedClassified,
    }),
  );
  expect(tree.readContent(`/commands/handlers/${dasherize(commandName)}.handler.ts`)).toEqual(
    getStringLiteralTemplate(ElementType.commandHandler, {
      name: commandName,
      expectedDasherized: expectedDasherized,
      expectedClassified: expectedClassified,
    }),
  );
}

export function expectCreatedCommandAndHandlerInPaths(
  tree: UnitTestTree,
  commandName: string,
  commandPath: string,
  handlerPath: string,
  specPath?: string,
) {
  expect(tree.files.find((filename) => filename === commandPath)).toBeDefined();
  expect(tree.files.find((filename) => filename === handlerPath)).toBeDefined();

  if (specPath) {
    expect(tree.files.find((filename) => filename === specPath)).toBeDefined();
  }

  expect(tree.readContent(commandPath)).toEqual(getStringLiteralTemplate(ElementType.command, { name: commandName }));
  expect(tree.readContent(handlerPath)).toEqual(
    getStringLiteralTemplate(ElementType.commandHandler, { name: commandName }),
  );
}

export function expectCreatedCommandAndHandlerWithSpec(
  tree: UnitTestTree,
  commandName: string,
  expectedDasherized: string,
  expectedClassified: string,
) {
  expect(
    tree.files.find((filename) => filename === `/commands/impl/${dasherize(commandName)}.command.ts`),
  ).toBeDefined();
  expect(
    tree.files.find((filename) => filename === `/commands/handlers/${dasherize(commandName)}.handler.ts`),
  ).toBeDefined();
  expect(tree.files.find((filename) => filename === '/commands/handlers/foo.handler.spec.ts')).toBeDefined();
  expect(tree.readContent(`/commands/impl/${dasherize(commandName)}.command.ts`)).toEqual(
    getStringLiteralTemplate(ElementType.command, {
      name: commandName,
      expectedDasherized: expectedDasherized,
      expectedClassified: expectedClassified,
    }),
  );
  expect(tree.readContent(`/commands/handlers/${dasherize(commandName)}.handler.ts`)).toEqual(
    getStringLiteralTemplate(ElementType.commandHandler, {
      name: commandName,
      expectedDasherized: expectedDasherized,
      expectedClassified: expectedClassified,
    }),
  );
}

export function expectNestProvidersArrayModuleToBeUpdatedInAppModule(tree: UnitTestTree, className: string) {
  const module = 'app';

  expect(tree.readContent(normalize('/src/' + module + '.module.ts'))).toEqual(
    "import { Module } from '@nestjs/common';\n" +
      'import { ' +
      classify(module) +
      "Controller } from './" +
      dasherize(module) +
      ".controller';\n" +
      'import { ' +
      classify(module) +
      "Service } from './" +
      dasherize(module) +
      ".service';\n" +
      'import { ' +
      classify(className) +
      "Handler } from './commands/handlers/" +
      dasherize(className) +
      ".handler';\n" +
      '\n' +
      '@Module({\n' +
      '  imports: [],\n' +
      '  controllers: [' +
      classify(module) +
      'Controller],\n' +
      '  providers: [' +
      classify(module) +
      'Service, ' +
      classify(className) +
      'Handler],\n' +
      '})\n' +
      'export class ' +
      classify(module) +
      'Module {}\n',
  );
}

export function expectNestProvidersArrayModuleToBeUpdatedInCustomModule(
  tree: UnitTestTree,
  className: string,
  module?: string,
) {
  module = !module ? 'app' : module;

  expect(tree.readContent(normalize('/src/' + module + '/' + module + '.module.ts'))).toEqual(
    "import { Module } from '@nestjs/common';\n" +
      'import { ' +
      classify(className) +
      "Handler } from './commands/handlers/" +
      dasherize(className) +
      ".handler';\n" +
      '\n' +
      '@Module({\n' +
      '  providers: [' +
      classify(className) +
      'Handler]\n' +
      '})\n' +
      'export class ' +
      classify(module) +
      'Module {}\n',
  );
}
