/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */


import "dotenv/config";

const connection = {
  host: "aws-0-ap-northeast-2.pooler.supabase.com",
  port: 5432,
  database: "postgres",
  user: "postgres.jbibbzfuireaercishpn",
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
};

export default {

  development: {
    client: 'postgresql',
    connection,
    
    migrations: {
      directory: "./db/migrations"
    },

    seeds: {
      directory: "./db/seeds"
    }

  },

  staging: {
    client: 'postgresql',
    connection,
    pool: {
      min: 2,
      max: 10
    },
    
    migrations: {
      tableName: 'knex_migrations',
      directory: "./db/migrations"
    },

    seeds: {
      directory: "./db/seeds"
    }

  },

  production: {
    client: 'postgresql',
    connection,
    pool: {
      min: 2,
      max: 10
    },
    
    migrations: {
      tableName: 'knex_migrations',
      directory: "./db/migrations"
    },

    seeds: {
      directory: "./db/seeds"
    }

  }

};
