const buyApis = require('./buy.api');

module.exports = {
  ...buyApis,
  query: async (event, query, bindings = []) => {
    const result = await global.knex.raw(query, bindings);
    event.reply('query', result);
  },
};
