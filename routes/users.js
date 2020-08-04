const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Team = require('../models/Team');

let router = express.Router();
const {validateRegister, validateLogin} = require('../util/validators');
const {SECRET_KEY} = require('../config');
const { checkAuth, checkRole } = require("../util/checkAuth");

const generateToken = (userInfo) => {
  return jwt.sign({
    id: userInfo.id,
    username: userInfo.username,
    role: userInfo.role
  },
	SECRET_KEY,
	{expiresIn: '4h'});
}

router.post("/login", async (req,res) => {
  let {username, password} = req.body;
  const {errors, valid} = validateLogin(username, password);
  if(!valid) return res.status(400).send(errors)

  const user = await User.findOne({username});
  if(!user) {
    errors.username = "El usuario no existe";
    return res.status(400).send(errors);
  }

  const passMatch = await bcrypt.compare(password, user.password);
  if(!passMatch) {
    errors.passwordMatch = "Las contraseñas no coinciden";
    res.status(400).send(errors);
  }

  const token = generateToken(user);
  res.send({
    ...user._doc,
    id: user._id,
    token,
  });
});

router.post("/register", async (req, res) => {
  // Validate for undef, null or format of the fields
  let { username, first_name, last_name, password, confirmPassword, email } = req.body;
  const { errors, valid } = validateRegister(
    username,
    first_name,
    last_name,
    password,
    confirmPassword,
    email
  );
  if (!valid) {
    return res.status(400).send(errors);
  }
  // Check if username already exists
  const user = await User.findOne({username})
  if (user) {
    return res.status(400).send({
      username: "El usuario ya existe"
    });
  }

  password = await bcrypt.hash(password, 12);
  const newUser = new User({
    role: 'Employee',
    username,
    first_name,
    last_name,
    password,
    email,
  });

  const result = await newUser.save();
  const token = generateToken(result);

  res.send({
    ...result._doc,
    id: result._id,
    token,
  });
});

router.delete("/:id", checkAuth, checkRole("Admin"), async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(400).send({
        userNotFound: "El usuario no existe.",
      });
    }
    const result = await user.remove();

    res.send("Usuario " + result.username + " Eliminado >:)");
  } catch(err) {
    return res.status(400).send({invalidId: "Formato id invalido."});
  }
});

router.get("/teams", async (req, res) => {
  const teams = await Team.find({});
  return res.send(teams);
});

router.post("/move", checkAuth, checkRole("Admin"), async (req, res) => {
  let { username, teamId } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).send({
      userNotFound: "Usuario no encontrado",
    });
  }

  try {
    const team = await Team.findById({ _id: teamId });
    if (!team)
      return res.status(400).send({
        teamNotFound: "Equipo no encontrado",
      });

    if (team.employees.find((emp) => emp.username === user.username)) {
      return res.status(400).send({
        userFound: "El usuario ya esta asignado a este equipo.",
      });
    } else {
      team.employees.push({
        user_id: user._id,
        username: user.username,
        email: user.email,
      });
      const result = await Team.findByIdAndUpdate(team._id, team);
      return res.send({ success: "Usuario agregado al equipo " + team.name });
    }
  } catch (err) {
    return res.status(400).send({ invalidId: "Formato id invalido." });
  }
});

module.exports = router;