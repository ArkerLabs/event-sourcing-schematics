import { StorableEvent } from 'event-sourcing-nestjs'

export class <%= classify(name) %> Event extends StorableEvent {
    
    eventAggregate = "<%= singularize(path) %>";
    eventVersion = 1;

    constructor(
        public readonly id: string
    ) {}
}
