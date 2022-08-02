const router = require('express').Router();
const { Project } = require('../../models');

//renders a list of all projects from the database.
router.get('/', async (req, res) => {
  try {
    const projectsData = await Project.findAll();
    const projects = projectsData.map(proj => proj.get({ plain: true }));
    res.render('homepage', { projects });

  } catch (err) {
    res.status(500).json(err);
  }
})

// renders an individual project's details based on the route parameter id.
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    const projects = []
    projects.push(project.get({ plain: true }));
    res.render('homepage', { projects });

  } catch (err) {
    res.status(500).json(err);
  }
})

router.post('/', async (req, res) => {
  try {
    const newProject = await Project.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newProject);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const projectData = await Project.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!projectData) {
      res.status(404).json({ message: 'No project found with this id!' });
      return;
    }

    res.status(200).json(projectData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
