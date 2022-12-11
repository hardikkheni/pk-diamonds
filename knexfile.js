const path = require('path');

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: path.join(__dirname, './public/service/migration'),
    tableName: 'migrations',
  },
  useNullAsDefault: true,
};
