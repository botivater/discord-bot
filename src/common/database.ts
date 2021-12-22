import k from "knex";

export const knex = k({
  client: "sqlite3",
  connection: {
    filename: "./dev.sqlite3",
  },
});
