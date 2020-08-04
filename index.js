require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 4000;
const { MONGOURI } = require("./config");
const {checkAuth, checkRole} = require("./util/checkAuth");

const app = express();

// Middlewares
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Routes
const users = require('./routes/users');
const projects = require('./routes/projects');
app.use('/users/', users);
app.use('/projects/', projects);

mongoose
  .connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Db Connected!"))
  .catch((err) => console.log(err));

app.get("/dashboard", checkAuth, (req, res) => {
  res.send("Welcome " + req.user.username + "!");
});

app.get("/admin_panel", checkAuth, checkRole("Admin"), (req,res) => {
  res.send("DASHBOARD OF ADMIN " + req.user.username);
})

app.listen(4000, () => {
  console.log("Server running in port " + PORT);
});

