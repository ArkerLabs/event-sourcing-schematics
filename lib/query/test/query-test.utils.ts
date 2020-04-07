import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { normalize } from 'path';

import { ElementType } from '../../utils/element-type.enum';
import { getStringLiteralTemplate } from '../../utils/test/template-string-literal.generator';

export function expectCreatedQueryAndHandler(
  tree: UnitTestTree,
  queryName: string,
  expectedDasherized: string,
  expectedClassified: string,
  moduleName: string,
) {
  expect(tree.files.find((filename) => filename === `/queries/impl/${dasherize(queryName)}.query.ts`)).toBeDefined();
  expect(
    tree.files.find((filename) => filename === `/queries/handlers/${dasherize(queryName)}.handler.ts`),
  ).toBeDefined();
  expect(
    tree.files.find((filename) => filename === `/queries/handlers/${dasherize(queryName)}.handler.spec.ts`),
  ).not.toBeDefined();
  expect(tree.readContent(`/queries/impl/${dasherize(queryName)}.query.ts`)).toEqual(
    getStringLiteralTemplate(ElementType.query, {
      name: queryName,
      expectedDasherized: expectedDasherized,
      expectedClassified: expectedClassified,
      module: moduleName,
    }),
  );
  expect(tree.readContent(`/queries/handlers/${dasherize(queryName)}.handler.ts`)).toEqual(
    getStringLiteralTemplate(ElementType.queryHandler, {
      name: queryName,
      expectedDasherized: expectedDasherized,
      expectedClassified: expectedClassified,
      module: moduleName,
    }),
  );
}

export function expectCreatedQueryAndHandlerInPaths(
  tree: UnitTestTree,
  queryName: string,
  queryPath: string,
  handlerPath: string,
  moduleName: string,
  specPath?: string,
) {
  expect(tree.files.find((filename) => filename === queryPath)).toBeDefined();
  expect(tree.files.find((filename) => filename === handlerPath)).toBeDefined();

  if (specPath) {
    expect(tree.files.find((filename) => filename === specPath)).toBeDefined();
  }

  expect(tree.readContent(queryPath)).toEqual(
    getStringLiteralTemplate(ElementType.query, { name: queryName, module: moduleName }),
  );
  expect(tree.readContent(handlerPath)).toEqual(
    getStringLiteralTemplate(ElementType.queryHandler, { name: queryName, module: moduleName }),
  );
}

export function expectCreatedQueryAndHandlerWithSpec(
  tree: UnitTestTree,
  queryName: string,
  moduleName: string,
  expectedDasherized: string,
  expectedClassified: string,
) {
  expect(tree.files.find((filename) => filename === `/queries/impl/${dasherize(queryName)}.query.ts`)).toBeDefined();
  expect(
    tree.files.find((filename) => filename === `/queries/handlers/${dasherize(queryName)}.handler.ts`),
  ).toBeDefined();
  expect(tree.files.find((filename) => filename === '/queries/handlers/foo.handler.spec.ts')).toBeDefined();
  expect(tree.readContent(`/queries/impl/${dasherize(queryName)}.query.ts`)).toEqual(
    getStringLiteralTemplate(ElementType.query, {
      name: queryName,
      expectedDasherized: expectedDasherized,
      expectedClassified: expectedClassified,
      module: moduleName,
    }),
  );
  expect(tree.readContent(`/queries/handlers/${dasherize(queryName)}.handler.ts`)).toEqual(
    getStringLiteralTemplate(ElementType.queryHandler, {
      name: queryName,
      expectedDasherized: expectedDasherized,
      expectedClassified: expectedClassified,
      module: moduleName,
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
      "Handler } from './queries/handlers/" +
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
      "Handler } from './queries/handlers/" +
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
