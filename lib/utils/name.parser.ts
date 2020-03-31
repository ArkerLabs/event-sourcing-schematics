import { basename, dirname, normalize, Path } from '@angular-devkit/core';

import { ElementType } from './element-type.enum';

export interface ParseOptions {
  name: string;
  path?: string;
  module?: string;
}

export interface Location {
  name: string;
  path: Path;
}

export class PathParser {
  public parse(type: ElementType, options: ParseOptions): Location {
    const nameWithoutPath: string = basename(options.name as Path);
    let path;

    // eslint-disable-next-line prefer-const
    path = this.parsePathBasedOnType(type, path, options);

    return {
      name: nameWithoutPath,
      path: normalize('/'.concat(path)),
    };
  }

  private parsePathBasedOnType(type: ElementType, path: any, options: ParseOptions) {
    switch (type) {
      case ElementType.command:
        path = this.parseCommandPath(options);
        break;
      case ElementType.commandHandler:
        path = this.parseCommandHandlerPath(options);
        break;
      case ElementType.event:
        path = this.parseEventPath(options);
        break;
      case ElementType.eventHandler:
        path = this.parseEventHandlerPath(options);
        break;
      case ElementType.eventUpdater:
        path = this.parseEventUpdaterPath(options);
        break;
      case ElementType.query:
        path = this.parseQueryPath(options);
        break;
      case ElementType.queryHandler:
        path = this.parseQueryHandlerPath(options);
        break;
    }
    return path;
  }

  parseQueryHandlerPath(options: ParseOptions): any {
    return dirname(
      (!options.module ? '' : (options.module as Path))
        .concat('/')
        .concat('queries')
        .concat('/')
        .concat('handlers')
        .concat('/') as Path,
    );
  }
  parseQueryPath(options: ParseOptions): any {
    return dirname(
      (!options.module ? '' : (options.module as Path))
        .concat('/')
        .concat('queries')
        .concat('/')
        .concat('impl')
        .concat('/') as Path,
    );
  }
  parseEventUpdaterPath(options: ParseOptions): any {
    return dirname(
      (!options.module ? '' : (options.module as Path))
        .concat('/')
        .concat('events')
        .concat('/')
        .concat('updaters')
        .concat('/') as Path,
    );
  }
  parseEventHandlerPath(options: ParseOptions): any {
    return dirname(
      (!options.module ? '' : (options.module as Path))
        .concat('/')
        .concat('events')
        .concat('/')
        .concat('handlers')
        .concat('/') as Path,
    );
  }
  parseEventPath(options: ParseOptions): any {
    return dirname(
      (!options.module ? '' : (options.module as Path))
        .concat('/')
        .concat('events')
        .concat('/')
        .concat('impl')
        .concat('/') as Path,
    );
  }

  parseCommandHandlerPath(options: ParseOptions): string {
    return dirname(
      (!options.module ? '' : (options.module as Path))
        .concat('/')
        .concat('commands')
        .concat('/')
        .concat('handlers')
        .concat('/') as Path,
    );
  }
  parseCommandPath(options: ParseOptions): string {
    return dirname(
      (!options.module ? '' : (options.module as Path))
        .concat('/')
        .concat('commands')
        .concat('/')
        .concat('impl')
        .concat('/') as Path,
    );
  }
}
