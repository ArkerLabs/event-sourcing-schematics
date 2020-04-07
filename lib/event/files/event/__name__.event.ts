import { StorableEvent } from 'event-sourcing-nestjs';

export class <%= classify(name) %>Event extends StorableEvent {

    eventAggregate = '<%= singularize(module) %>';
    eventVersion = 1;

    constructor(
        public readonly id: string
    ) {}
}