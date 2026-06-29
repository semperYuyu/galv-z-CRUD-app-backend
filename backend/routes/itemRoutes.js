const {
  viewAllItems,
  viewSingleItem,
  createNewItem,
  updateItem,
  removeItem,
} = require("../controllers/itemController");
const express = require("express");
const router = express();

// root route is /items in server.js, in here its /
router.get("/", viewAllItems);
router.get("/:itemId", viewSingleItem);
router.post("/new", createNewItem);
router.patch("/:itemId", updateItem);
router.delete("/:itemId", removeItem);

module.exports = router;
