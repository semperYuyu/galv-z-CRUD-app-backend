/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const bcrypt = require("bcrypt");
require("dotenv").config();
const salt_rounds = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  const seed_users = ["Catti Cattenheimer", "Kris Deltarune", "Susie Gaster"];
  let user_array = [];
  seed_users.forEach((user, index) => {
    const first = user.match("^[a-zA-Z]+")[0];
    const last = user.match("[a-zA-Z]+$")[0];
    const password = bcrypt.hashSync(user, salt_rounds);
    user_array.push({
      id: index + 50000,
      first_name: first,
      last_name: last,
      username: first.toLowerCase() + last.toLowerCase(),
      password: password,
    });
  });
  await knex("users").del();
  await knex("users").insert(user_array);
};
