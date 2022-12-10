module.exports = {
  async 'sell.insert'(event, obj) {
    try {
      const [id] = await global.knex('sells').insert(obj);
      const row = await global.knex('sells').where('id', id).first();
      event.reply('sell.insert', row);
    } catch (err) {
      event.reply('sell.insert.error', err.message);
    }
  },
  async 'sell.paginate'(event, { page, limit }) {
    try {
      const start = page * limit;
      const [res] = await global.knex('sells').count({ count: '*' });
      const rows = await global
        .knex('sells')
        .orderBy('id', 'desc')
        .limit(limit, { skipBindings: true })
        .offset(start, { skipBindings: true });
      event.reply('sell.paginate', { rows, total: res.count });
    } catch (err) {
      event.reply('sell.paginate.error', err.message);
    }
  },
  async 'sell.update'(event, { id, obj }) {
    try {
      const { id: _id, ...update } = obj;
      const [row] = await global
        .knex('sells')
        .where('id', id)
        .update(update, ['*']);
      event.reply('sell.update', row);
    } catch (err) {
      event.reply('sell.update.error', err.message);
    }
  },
  async 'sell.delete'(event, id) {
    try {
      const deleted = await global.knex('sells').where('id', id).del();
      event.reply('sell.delete', !!deleted);
    } catch (err) {
      event.reply('sell.delete.error', err.message);
    }
  },
};
