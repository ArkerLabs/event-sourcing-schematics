import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { <%= classify(name) %>Query } from '../impl/<%= dasherize(name) %>.query';

@QueryHandler(<%= classify(name) %>Query)
export class <%= classify(name) %>Handler implements IQueryHandler<<%= classify(name) %>Query> {

    async execute(query: <%= classify(name) %>Query) {
    }
}