import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { normalize } from 'path';

import { ElementType } from '../../utils/element-type.enum';
import { getStringLiteralTemplate } from '../../utils/test/template-string-literal.generator';

export function expectCreatedEvent(
  tree: UnitTestTree,
  eventName: string,
  expectedDasherized: string,
  expectedClassified: string,
) {
  expect(tree.files.find((filename) => filename === `/events/impl/${dasherize(eventName)}.event.ts`)).toBeDefined();

  expect(tree.readContent(`/events/impl/${dasherize(eventName)}.event.ts`)).toEqual(
    getStringLiteralTemplate(ElementType.event, {
      name: eventName,
      expectedDasherized: expectedDasherized,
      expectedClassified: expectedClassified,
    }),
  );
}

export function expectCreatedEventHandler(
  tree: UnitTestTree,
  eventName: string,
  shouldSpecBeDefined: boolean,
  expectedDasherized: string,
  expectedClassified: string,
) {
  expect(
    tree.files.find((filename) => filename === `/events/handlers/${dasherize(eventName)}.handler.ts`),
  ).toBeDefined();

  if (shouldSpecBeDefined) {
    expect(
      tree.files.find((filename) => filename === `/events/handlers/${dasherize(eventName)}.handler.spec.ts`),
    ).toBeDefined();
  } else {
    expect(
      tree.files.find((filename) => filename === `/events/handlers/${dasherize(eventName)}.handler.spec.ts`),
    ).not.toBeDefined();
  }

  if (shouldSpecBeDefined) {
    expect(tree.readContent(`/events/handlers/${dasherize(eventName)}.handler.spec.ts`)).toEqual(
      getStringLiteralTemplate(ElementType.eventHandlerSpec, {
        name: eventName,
        expectedDasherized: expectedDasherized,
        expectedClassified: expectedClassified,
      }),
    );
  }

  expect(tree.readContent(`/events/handlers/${dasherize(eventName)}.handler.ts`)).toEqual(
    getStringLiteralTemplate(ElementType.eventHandler, {
      name: eventName,
      expectedDasherized: expectedDasherized,
      expectedClassified: expectedClassified,
    }),
  );
}

export function expectNotCreatedEventHandler(tree: UnitTestTree, eventName: string) {
  expect(
    tree.files.find((filename) => filename === `/events/handlers/${dasherize(eventName)}.handler.ts`),
  ).not.toBeDefined();
}

export function expectCreatedEventUpdater(
  tree: UnitTestTree,
  eventName: string,
  shouldSpecBeDefined: boolean,
  expectedDasherized: string,
  expectedClassified: string,
) {
  expect(
    tree.files.find((filename) => filename === `/events/updaters/${dasherize(eventName)}.updater.ts`),
  ).toBeDefined();

  if (shouldSpecBeDefined) {
    expect(
      tree.files.find((filename) => filename === `/events/updaters/${dasherize(eventName)}.updater.spec.ts`),
    ).toBeDefined();
  } else {
    expect(
      tree.files.find((filename) => filename === `/events/updaters/${dasherize(eventName)}.updater.spec.ts`),
    ).not.toBeDefined();
  }

  if (shouldSpecBeDefined) {
    expect(tree.readContent(`/events/updaters/${dasherize(eventName)}.updater.spec.ts`)).toEqual(
      getStringLiteralTemplate(ElementType.eventUpdaterSpec, {
        name: eventName,
        expectedDasherized: expectedDasherized,
        expectedClassified: expectedClassified,
      }),
    );
  }

  expect(tree.readContent(`/events/updaters/${dasherize(eventName)}.updater.ts`)).toEqual(
    getStringLiteralTemplate(ElementType.eventUpdater, {
      name: eventName,
      expectedDasherized: expectedDasherized,
      expectedClassified: expectedClassified,
    }),
  );
}

export function expectNotCreatedEventUpdater(tree: UnitTestTree, eventName: string) {
  expect(
    tree.files.find((filename) => filename === `/events/updaters/${dasherize(eventName)}.updater.ts`),
  ).not.toBeDefined();
}

export function expectCreatedEventInPaths(
  tree: UnitTestTree,
  eventName: string,
  eventPath: string,
  handlerPath: string,
  updaterPath: string,
  specPath?: string,
) {
  expect(tree.files.find((filename) => filename === eventPath)).toBeDefined();
  expect(tree.files.find((filename) => filename === handlerPath)).toBeDefined();

  if (specPath) {
    expect(tree.files.find((filename) => filename === specPath)).toBeDefined();
  }

  expect(tree.readContent(eventPath)).toEqual(getStringLiteralTemplate(ElementType.event, { name: eventName }));
  expect(tree.readContent(handlerPath)).toEqual(
    getStringLiteralTemplate(ElementType.eventHandler, { name: eventName }),
  );

  expect(tree.readContent(updaterPath)).toEqual(
    getStringLiteralTemplate(ElementType.eventUpdater, { name: eventName }),
  );
}

export function expectNestProvidersArrayModuleToBeUpdatedInAppModule(
  tree: UnitTestTree,
  className: string,
  module?: string,
) {
  module = !module ? 'app' : module;

  // prettier-ignore
  expect(tree.readContent(normalize('/src/' + module + '.module.ts'))).toEqual(
    "import { Module } from '@nestjs/common';\n" +
    "import { AppController } from './app.controller';\n" +
    "import { AppService } from './app.service';\n" +
    'import { ' + classify(className) +"Handler } from './events/handlers/" +dasherize(className) +".handler';\n" +
    'import { ' + classify(className) +"Updater } from './events/updaters/" +dasherize(className) +".updater';\n" +
    '\n' +
    '@Module({\n' +
    '  imports: [],\n' +
    '  controllers: [AppController],\n' +
    '  providers: [AppService, ' + classify(className) +'Handler, ' + classify(className) +'Updater],\n' +
      '})\n' +
      'export class ' +
      classify(module) +
      'Module {}\n',
  );
}

export function expectNestProvidersArrayModuleToBeUpdatedWithEventsInCustomModule(
  tree: UnitTestTree,
  className: string,
  module?: string,
) {
  module = !module ? 'app' : module;

  expect(tree.readContent(normalize('/src/' + module + '/' + module + '.module.ts'))).toEqual(
    "import { Module } from '@nestjs/common';\n" +
      'import { ' +
      classify(className) +
      "Handler } from './events/handlers/" +
      dasherize(className) +
      ".handler';\n" +
      'import { ' +
      classify(className) +
      "Updater } from './events/updaters/" +
      dasherize(className) +
      ".updater';\n" +
      '\n' +
      '@Module({\n' +
      '  providers: [' +
      classify(className) +
      'Handler, ' +
      classify(className) +
      'Updater]\n' +
      '})\n' +
      'export class ' +
      classify(module) +
      'Module {}\n',
  );
}
