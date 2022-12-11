const buyApis = require('./buy.api');
const sellApis = require('./sell.api');

module.exports = {
  ...buyApis,
  ...sellApis,
  query: async (event, query, bindings = []) => {
    const result = await global.knex.raw(query, bindings);
    event.reply('query', result);
  },
};
