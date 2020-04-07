import pluralize = require('pluralize');

export const singularize = (value: string) => {
  return pluralize.singular(value);
};

export const pluralizeString = (value: string) => {
  return pluralize(value);
};
