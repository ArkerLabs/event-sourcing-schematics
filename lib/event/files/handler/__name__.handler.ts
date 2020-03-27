import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { <%= classify(name) %>Event } from '../impl/<%= dasherize(name) %>.event';

@EventsHandler(<%= classify(name) %>Event)
export class <%= classify(name) %>Handler implements IEventHandler<<%= classify(name) %>Event> {

    handle(event: <%= classify(name) %>Event) {
    }
}