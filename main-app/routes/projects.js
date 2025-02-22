const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Auth middleware - moved to separate middleware folder
const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ 
      message: 'Not authenticated',
      redirectTo: '/login'
    });
  }
  next();
};

// Apply auth middleware to all routes
router.use(isAuthenticated);

// Get all projects for current user
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.session.userId })
      .select('name updatedAt')
      .sort({ updatedAt: -1 });
    
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.session.userId,
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new project
router.post('/', async (req, res) => {
  try {
    const { name, code } = req.body;
    
    const project = new Project({
      userId: req.session.userId,
      name,
      code,
    });
    
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an existing project
router.put('/:id', async (req, res) => {
  try {
    const { name, code } = req.body;
    
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.userId },
      { 
        name, 
        code,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const result = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId,
    });
    
    if (!result) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;