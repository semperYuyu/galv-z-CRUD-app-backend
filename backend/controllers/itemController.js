const knex = require("../db/db");
const { verifyAll } = require("../functions/queryFunctions");

//--------------------------------------------------------------------------------------------------------------------

const viewAllItems = async (req, res) => {
  try {
    const data = await knex("items").select(
      "id",
      "item_name",
      "description",
      "quantity",
    );
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal Server Error" });
  }
}; // GET /items ^

//--------------------------------------------------------------------------------------------------------------------

const viewSingleItem = async (req, res) => {
  const { itemId } = req.params;
  try {
    const data = await knex("items").select("*").where("id", itemId).first();
    console.log(data.user_id);
    const user = await knex("users")
      .select("username")
      .where("id", data.user_id)
      .first();
    data.owner = user.username;

    if (!data) {
      return res.status(404).json({ error: "Item not found." });
    }

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}; // GET /items/:itemId ^

//--------------------------------------------------------------------------------------------------------------------

const createNewItem = async (req, res) => {
  const { user_id, item_name, description, quantity } = req.body;
  // id is auto created via table.increments()

  if (!verifyAll(user_id, item_name, description, quantity)) {
    return res.status(400).json({ error: "Missing or Incorrect data" });
  }

  try {
    const data = await knex("items")
      .insert({
        user_id,
        item_name,
        description,
        quantity,
      })
      .returning("*");
    return res.status(201).json({ data: data[0] });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}; // POST /items/new ^

//--------------------------------------------------------------------------------------------------------------------

const updateItem = async (req, res) => {
  const { item_name, description, quantity } = req.body;
  const { itemId } = req.params;
  const updates = {};

  if (!itemId) {
    return res.status(400).json({ error: "ID field missing" });
  }

  if (item_name) updates.item_name = item_name;
  if (description) updates.description = description;
  if (quantity) updates.quantity = quantity;

  if (Object.keys(updates).length < 1) {
    return res.status(400).json({ error: "All fields undefined" });
  }

  try {
    const [data] = await knex("items")
      .where("id", itemId)
      .update(updates)
      .returning("*");

    if (!data) {
      return res.status(400).json({ error: "Could not find item" });
    }
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}; // PATCH /items/:itemId ^

//--------------------------------------------------------------------------------------------------------------------

const removeItem = async (req, res) => {
  const { itemId } = req.params;

  if (!itemId) {
    return res.status(400).json({ error: "Missing Item ID" });
  }

  try {
    const data = await knex("items").where("id", itemId).del();

    if (!data) {
      return res.status(400).json({ error: "Item not found" });
    }

    return res.status(200).json("Item successfully deleted!");
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}; // DELETE /items/:itemId ^

//--------------------------------------------------------------------------------------------------------------------

module.exports = {
  viewAllItems,
  viewSingleItem,
  createNewItem,
  updateItem,
  removeItem,
};
