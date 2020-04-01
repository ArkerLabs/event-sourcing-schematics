import { join, normalize, Path, strings } from '@angular-devkit/core';
import { Rule, Tree } from '@angular-devkit/schematics';

import { DEFAULT_PATH_NAME } from '../defaults';
import { PathParser } from '../utils';
import { ElementType } from './element-type.enum';

export function isInRootDirectory(host: Tree, extraFiles: string[] = []): boolean {
  const files = ['nest-cli.json', 'nest.json'].concat(extraFiles || []);
  return files.map((file) => host.exists(file)).some((isPresent) => isPresent);
}

export function mergeSourceRoot<T extends { sourceRoot?: string; path?: string } = any>(options: T): Rule {
  return (host: Tree) => {
    const isInRoot = isInRootDirectory(host, ['tsconfig.json', 'package.json']);
    if (!isInRoot) {
      return host;
    }
    const defaultSourceRoot = options.sourceRoot !== undefined ? options.sourceRoot : DEFAULT_PATH_NAME;

    options.path =
      options.path !== undefined ? join(normalize(defaultSourceRoot), options.path) : normalize(defaultSourceRoot);

    return host;
  };
}

export const ELEMENT_METADATA = 'providers';
export const COMMAND_TYPE = 'command';
export const HANDLER_TYPE = 'handler';
export const EVENT_TYPE = 'event';
export const UPDATER_TYPE = 'updater';
export const QUERY_TYPE = 'query';

export function modifyOptions<
  T extends {
    name: string;

    module: string | Path;

    path?: string | Path;

    skipImport?: boolean;

    metadata?: string;

    fileType?: string;

    elementType?: string;

    sourceRoot?: string;

    createHandler?: boolean | string;

    createUpdater?: boolean | string;

    spec?: boolean | string;
  }
>(type: ElementType, options: T): Rule {
  return (host: Tree) => {
    options.elementType = type.toString();

    if (options.createHandler === 'true') {
      options.createHandler = true;
    }

    if (options.createHandler === 'false') {
      options.createHandler = false;
    }

    if (options.createUpdater === 'true') {
      options.createUpdater = true;
    }

    if (options.createUpdater === 'false') {
      options.createUpdater = false;
    }

    if (options.spec === 'true') {
      options.spec = true;
    }

    if (options.spec === 'false') {
      options.spec = false;
    }
    switch (type) {
      case ElementType.command:
        options.fileType = COMMAND_TYPE;
        break;

      case ElementType.commandHandler:
        options.fileType = HANDLER_TYPE;
        options.metadata = ELEMENT_METADATA;
        break;

      case ElementType.event:
        options.fileType = EVENT_TYPE;
        break;

      case ElementType.eventHandler:
        options.fileType = HANDLER_TYPE;
        options.metadata = ELEMENT_METADATA;
        break;

      case ElementType.eventUpdater:
        options.fileType = UPDATER_TYPE;
        options.metadata = ELEMENT_METADATA;
        break;

      case ElementType.query:
        options.fileType = QUERY_TYPE;
        break;

      case ElementType.queryHandler:
        options.fileType = HANDLER_TYPE;
        options.metadata = ELEMENT_METADATA;
        break;
    }

    const location = new PathParser().parse(type, options);
    options.name = strings.dasherize(location.name);
    options.path = strings.dasherize(location.path);

    return host;
  };
}
