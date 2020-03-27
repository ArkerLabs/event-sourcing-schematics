import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { <%= classify(name) %>Query } from '../impl/<%= dasherize(name) %>.query';

@EventsHandler(<%= classify(name) %>Query)
export class <%= classify(name) %>Handler implements IEventHandler<<%= classify(name) %>Query> {

    handle(event: <%= classify(name) %>Query) {
    }
}