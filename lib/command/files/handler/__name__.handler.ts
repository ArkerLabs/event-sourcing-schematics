import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { <%= classify(name) %>Command } from '../impl/<%= dasherize(name) %>.command';
import { StoreEventBus } from 'event-sourcing-nestjs';

@CommandHandler(<%= classify(name) %>Command)
export class <%= classify(name) %>Handler implements ICommandHandler<<%= classify(name) %>Command> {

    constructor(
        private readonly eventBus: StoreEventBus,
    ) {}

    async execute(command: <%= classify(name) %>Command) {

    }

}
