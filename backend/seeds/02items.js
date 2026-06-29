/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries

  const seed_items = [
    "Cat Food Coupons",
    "25% Yellow, 75% Red Juice",
    "Pumpkin Seeds",
    "Wallet",
    "Kitty Cat Keys",
    "Golden Hook Earrings",
    "Trackball Mouse",
    "Garbage Bags",
    "Keyboards",
    "Foam Hammer",
    "Notebook",
    "Peppermint Pencil",
    "Old Dusty Jar",
    "Silver Watch",
    "Red Headband",
  ];
  const user_ids = [50000, 50001, 50002];
  let item_array = [];

  seed_items.forEach((item, index) => {
    item_array.push({
      id: index + 50000,
      user_id: user_ids[Math.floor(Math.random() * 2 + 0.5)],
      item_name: item,
      description: `A ${item} !`,
      quantity: Math.ceil(Math.random() * 100 + 0.5),
    });
  });
  await knex("items").del();
  await knex("items").insert(item_array);
};
