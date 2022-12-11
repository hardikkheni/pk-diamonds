/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('sells', function (table) {
    table.bigIncrements();
    table.string('name');
    table.float('weight', 3, 10);
    table.float('price', 3, 10);
    table.string('currency');
    table.float('currency_in_rupee', 3, 10);
    table.float('discount', 3, 10).nullable();
    table.float('brokerage', 3, 10).nullable();
    table.date('sell_date');
    table.integer('terms').nullable();
    table.string('party').nullable();
    table.string('broker').nullable();
    table.text('details').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('sells');
};
