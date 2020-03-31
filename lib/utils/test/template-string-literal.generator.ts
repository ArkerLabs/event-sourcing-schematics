import { classify, dasherize } from '@angular-devkit/core/src/utils/strings';

import { ElementType } from '../element-type.enum';

export const getStringLiteralTemplate = (
  type: ElementType,
  options: { name: string; expectedDasherized?: string; expectedClassified?: string },
): string => {
  const target = {
    expectedClassified: options.expectedClassified || classify(options.name),
    expectedDasherized: options.expectedDasherized || dasherize(options.name),
    name: options.name,
  };

  switch (type) {
    case ElementType.command:
      return getCommandFileStringLiteral(target);

    case ElementType.commandHandler:
      return getCommandHandlerFileStringLiteral(target);

    case ElementType.commandSpec:
      return getCommandHandlerSpecFileStringLiteral(target);

    case ElementType.event:
      return getEventFileStringLiteral(target);

    case ElementType.eventHandler:
      return getEventHandlerFileStringLiteral(target);

    case ElementType.eventUpdater:
      return getEventUpdaterFileStringLiteral(target);

    case ElementType.eventHandlerSpec:
      return getEventHandlerSpecFileStringLiteral(target);

    case ElementType.eventUpdaterSpec:
      return getEventUpdaterSpecFileStringLiteral(target);

    case ElementType.query:
      return getQueryFileStringLiteral(target);

    case ElementType.queryHandler:
      return getQueryHandlerFileStringLiteral(target);

    case ElementType.queryHandlerSpec:
      return getQueryHandlerSpecFileStringLiteral(target);

    default:
      break;
  }
};

// prettier-ignore
const getCommandFileStringLiteral = (options: { name: string; expectedDasherized: string; expectedClassified: string }): string => {
  return 'export class ' + options.expectedClassified + 'Command {\n' + '    constructor() {}\n' + '}\n';
};

// prettier-ignore
const getCommandHandlerFileStringLiteral = (options): string => {
  return (
    "import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';\n" +
    'import { ' +
    options.expectedClassified +
    "Command } from '../impl/" +
    options.expectedDasherized +
    ".command';\n" +
    "import { StoreEventBus } from 'event-sourcing-nestjs';\n" +
    '\n' +
    '@CommandHandler(' +
    options.expectedClassified +
    'Command)\n' +
    'export class ' +
    options.expectedClassified +
    'Handler implements ICommandHandler<' +
    options.expectedClassified +
    'Command> {\n' +
    '\n' +
    '    constructor(\n' +
    '        private readonly eventBus: StoreEventBus,\n' +
    '    ) {}\n' +
    '\n' +
    '    async execute(command: ' +
    options.expectedClassified +
    'Command) {\n' +
    '\n' +
    '    }\n' +
    '\n' +
    '}\n'
  );
};

// prettier-ignore
const getCommandHandlerSpecFileStringLiteral = (options: { name: string; expectedDasherized: string; expectedClassified: string }): string => {
  return 'import { ' + options.expectedClassified + "Handler } from './" + options.expectedDasherized + ".handler';\n" + '\n' + "describe('" + options.expectedClassified + " Handler', () => {\n" + '  let handler: ' + options.expectedClassified + 'Handler;\n' + '\n' + "  it('should be defined', () => {\n" + '    expect(handler).toBeDefined();\n' + '  });\n' + '});';
};

// prettier-ignore
const getQueryFileStringLiteral = (options: { name: string; expectedDasherized: string; expectedClassified: string }): string => {
  return 'export class ' + options.expectedClassified + 'Query {\n' + '    constructor() {}\n' + '}\n';
};
// prettier-ignore
const getQueryHandlerFileStringLiteral = (options): string => {
  return (
    "import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';\n" +
    'import { ' + options.expectedClassified +"Query } from '../impl/" +options.expectedDasherized +".query';\n" +
    '\n' +
    '@QueryHandler(' +options.expectedClassified +'Query)\n' +
    'export class ' +options.expectedClassified +'Handler implements IQueryHandler<' +options.expectedClassified +'Query> {\n' +
    '\n' +
    '    async execute(query: ' + options.expectedClassified + 'Query) {\n' +
    '    }\n' +
    '}'
  );
};

// prettier-ignore
const getQueryHandlerSpecFileStringLiteral = (options: { name: string; expectedDasherized: string; expectedClassified: string }): string => {
  return 'import { ' + options.expectedClassified + "Handler } from './" + options.expectedDasherized + ".handler';\n" +
   '\n' +
    "describe('" + options.expectedClassified + " Handler', () => {\n" +
    '  let handler: ' + options.expectedClassified + 'Handler;\n' +
    '\n'+ 
    "  it('should be defined', () => {\n" +
    '    expect(handler).toBeDefined();\n' +
    '  });\n' +
    '});';
};

// prettier-ignore
const getEventFileStringLiteral = (options: { name: string; expectedDasherized: string; expectedClassified: string }): string => {
  return 'export class ' + options.expectedClassified + 'Event {\n' + '    constructor() {}\n' + '}\n';
};

// prettier-ignore
const getEventHandlerFileStringLiteral = (options: { name: string; expectedDasherized: string; expectedClassified: string }): string => {
  return (
    "import { IEventHandler } from '@nestjs/cqrs';\n" +
    "import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';\n" +
    'import { ' +options.expectedClassified +"Event } from '../impl/" +options.expectedDasherized +".event';\n" +
    '\n' +
    '@EventsHandler(' +options.expectedClassified +'Event)\n' +
    'export class ' +options.expectedClassified +'Handler implements IEventHandler<' +options.expectedClassified +'Event> {\n' +
    '\n'+
    '    handle(event: ' +options.expectedClassified +'Event) {\n' +
    '    }\n' +
    '}'
  );
};

// prettier-ignore
const getEventHandlerSpecFileStringLiteral = (options: { name: string; expectedDasherized: string; expectedClassified: string }): string => {
  return 'import { ' + options.expectedClassified + "Handler } from './" + options.expectedDasherized + ".handler';\n" +
   '\n' +
  "describe('" + options.expectedClassified + " Handler', () => {\n" + 
  '   let handler: ' + options.expectedClassified + 'Handler;\n'+
  '\n' +
  "   it('should be defined', () => {\n" +
  '     expect(handler).toBeDefined();\n' +
  '   });\n' +
  '});';
};

// prettier-ignore
const getEventUpdaterFileStringLiteral = (options: { name: string; expectedDasherized: string; expectedClassified: string }): string => {
  return (
    "import { IViewUpdater, ViewUpdaterHandler } from 'event-sourcing-nestjs';\n" +
    'import { ' +options.expectedClassified +"Event } from '../impl/" +options.expectedDasherized +".event';\n" +
    '\n' +
    '@ViewUpdaterHandler(' +options.expectedClassified +'Event)\n' +
    'export class ' +options.expectedClassified +'Updater implements IViewUpdater<' +options.expectedClassified +'Event> {\n' +
    '\n'+
    '    async handle(event: ' +options.expectedClassified +'Event) {\n' +
    '    }\n' +
    '}'
  );
};

// prettier-ignore
const getEventUpdaterSpecFileStringLiteral = (options: { name: string; expectedDasherized: string; expectedClassified: string }): string => {
  return 'import { ' + options.expectedClassified + "Updater } from './" + options.expectedDasherized + ".updater';\n" +
   "import { " + options.expectedClassified + "Event } from '../impl/" + options.expectedDasherized + ".event';\n" +
   "\n"+
  "describe('" + options.expectedClassified + "Updater', () => {\n" + 
  '});';
};
