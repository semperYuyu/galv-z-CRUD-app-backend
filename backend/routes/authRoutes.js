const {
  signup,
  login,
  getInventory,
} = require("../controllers/authController");
const express = require("express");
const router = express();

// root route is /auth, here its /
router.get("/inventory/:userId", getInventory);
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
