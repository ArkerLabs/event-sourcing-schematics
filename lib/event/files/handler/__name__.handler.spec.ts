
import { <%= classify(name) %>Handler } from './<%= dasherize(name) %>.handler';

describe('<%= classify(name) %> Handler', () => {
  let handler: <%= classify(name) %>Handler;


  it('should be defined', () => {
    expect(handler).toBeDefined();
  });
});
