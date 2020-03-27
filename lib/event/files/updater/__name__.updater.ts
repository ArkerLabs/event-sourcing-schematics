import { IViewUpdater, ViewUpdaterHandler } from 'event-sourcing-nestjs';
import { <%= classify(name) %>Event } from '../impl/<%= dasherize(name) %>.event';

@ViewUpdaterHandler(<%= classify(name) %>Event)
export class <%= classify(name) %>Updater implements IViewUpdater<<%= classify(name) %>Event> {

    async handle(event: <%= classify(name) %>Event) {
    }
}