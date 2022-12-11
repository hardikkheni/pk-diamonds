module.exports = {
  async 'buy.insert'(event, obj) {
    try {
      const { id: _id, ...insert } = obj;
      const [id] = await global.knex('buys').insert(insert);
      const row = await global.knex('buys').where('id', id).first();
      event.reply('buy.insert', row);
    } catch (err) {
      event.reply('buy.insert.error', err.message);
    }
  },
  async 'buy.paginate'(event, { page, limit }) {
    try {
      const start = page * limit;
      const [res] = await global.knex('buys').count({ count: '*' });
      const rows = await global
        .knex('buys')
        .orderBy('id', 'desc')
        .limit(limit, { skipBindings: true })
        .offset(start, { skipBindings: true });
      event.reply('buy.paginate', { rows, total: res.count });
    } catch (err) {
      event.reply('buy.paginate.error', err.message);
    }
  },
  async 'buy.update'(event, { id, obj }) {
    try {
      const { id: _id, ...update } = obj;
      const [row] = await global
        .knex('buys')
        .where('id', id)
        .update(update, ['*']);
      event.reply('buy.update', row);
    } catch (err) {
      event.reply('buy.update.error', err.message);
    }
  },
  async 'buy.delete'(event, id) {
    try {
      const deleted = await global.knex('buys').where('id', id).del();
      event.reply('buy.delete', !!deleted);
    } catch (err) {
      event.reply('buy.delete.error', err.message);
    }
  },
};
