const bcrypt = require("bcrypt"); // encryption
const knex = require("../db/db");
const { verifyAll } = require("../functions/queryFunctions");
require("dotenv").config();
const salt_rounds = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
const environment = process.env.NODE_ENV;

//--------------------------------------------------------------------------------------------------------------------

const signup = async (req, res) => {
  const { first_name, last_name, username, password } = req.body;

  if (!verifyAll(first_name, last_name, username, password)) {
    return res.status(400).json({ error: "All data fields are required" });
  }

  const check = await knex("users")
    .select("id")
    .where("username", username)
    .first();

  if (check) {
    return res.status(400).json({ error: "That username is already taken!" });
  }
  const hashed_password = bcrypt.hashSync(password, salt_rounds);
  try {
    const data = await knex("users")
      .insert({
        first_name,
        last_name,
        username,
        password: hashed_password,
      })
      .returning("id");

    res.cookie("userId", data[0].id, {
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
      httpOnly: false,
      partitioned: true,
    });

    return res.status(201).json({ data: data[0] });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}; // POST /signup ^

//--------------------------------------------------------------------------------------------------------------------

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!verifyAll(username, password)) {
    return res.status(400).json({ error: "Username \ Password required" });
  }

  const checkUser = await knex("users")
    .select("*")
    .where("username", username)
    .first();

  if (!checkUser) {
    return res.status(400).json({ error: "Username not found" });
  }

  const checkPassword = bcrypt.compareSync(password, checkUser.password);

  if (!checkPassword) {
    return res.status(400).json({ error: "Incorrect Password" });
  }

  try {
    res.cookie("userId", checkUser.id, {
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
      httpOnly: false,
      partitioned: true,
    });

    return res.status(200).json({ message: `Successfully logged in!` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}; // POST /login ^

//--------------------------------------------------------------------------------------------------------------------

const getInventory = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "Missing User ID" });
  }

  const check = await knex("users").select("*").where("id", userId).first();

  if (!check) {
    return res.status(400).json({ error: "User not found" });
  }

  try {
    const data = await knex("items").select("*").where("user_id", userId);

    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}; // GET /inventory/:userId ^

//--------------------------------------------------------------------------------------------------------------------

module.exports = { signup, login, getInventory };
