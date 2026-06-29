const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT;
const origin = process.env.CLIENT_ORIGIN || process.env.TEST_CLIENT_ORIGIN;

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");

app.use(cookieParser(process.env.SERVER_COOKIE_SECRET));
app.use(express.json());

app.use(
  cors({
    origin: origin,
    credentials: true, // allows for cookies
  }),
);

app.use("/auth", authRoutes);
app.use("/items", itemRoutes);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "bienvenue~ :3c" });
});

app.listen(port, () =>
  console.log(`server is listen at http://localhost:${port} :D`),
);
