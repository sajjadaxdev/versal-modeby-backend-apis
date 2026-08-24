import knexConfig from "../knexfile.js";
import knexLib from "knex";

const knex = knexLib(knexConfig.development);

export default knex;