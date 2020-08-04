const express = require("express");
const Project = require('../models/Project');
const {checkAuth, checkRole} = require('../util/checkAuth');
let router = express.Router();

// Una vez verificado el token, tenemos en req.user la info.
router.post("/add", checkAuth, async (req, res) => {
  let { title, description } = req.body;
  if (!title || !description) {
    res.status(400);
    return res.send({
      fields: "Los campos no pueden ser vacios",
    });
  }

  const newProject = new Project({
    user_id: req.user.id,
    title,
    description,
  });
  const result = await newProject.save();
  return res.send(result);

});

router.get("/", checkAuth, checkRole("Admin"), async (req,res) => {
  const projects = await Project.find({});
  return res.send(projects);
});

router.get("/:id", checkAuth, async (req,res) => {
  const id = req.params.id;
  try {
    const project = await Project.findById({ _id: id });
    if (!project) {
      return res.status(400).send({
        projectNotFound: "El proyecto no existe",
      });
    }

    if (project.user_id === req.user.id || req.user.role === "Admin") {
      return res.send(project);
    }

    return res.status(403).send({
      permissionError: "No tienes permiso para ver este projecto."
    });
  } catch (err) {
    return res.status(400).send({invalidId: "Formato id invalido."});
  }
});

router.delete("/:id", checkAuth, async (req, res) => {
  const id = req.params.id;
  try {
    const project = await Project.findById({ _id: id });
    if (!project) {
      return res.status(400).send({
        projectNotFound: "El proyecto no existe"
      });
    }

    if (project.user_id === req.user.id || req.user.role === "Admin") {
      const result = await project.remove();
      return res.send(result);
    }

    return res.status(403).send({
      permissionError: "No tienes permiso para borrar este proyecto."
    });
  } catch (err) {
    return res.status(400).send({invalidId: "Formato id invalido."});
  }
});


module.exports = router;