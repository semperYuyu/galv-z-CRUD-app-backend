/**
 *  @type { Object.<string, import("knex").Knex.Config> }
 */

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "127.0.0.1",
      port: 5432,
      user: "postgres",
      password: "postgres",
      database: "inventory_management",
    },
    pool: { min: 2, max: 10 },
    acquireConnectionTimeout: 10000,
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 10 },
    acquireConnectionTimeout: 10000,
  },
};
