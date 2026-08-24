import knexConfig from "../knexfile.js";
import knexLib from "knex";

const knex = knexLib(knexConfig[process.env.NODE_ENV || "development"]);

export default knex;