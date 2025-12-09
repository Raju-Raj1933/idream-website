const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { validateProject } = require('../utils/validators');
const { ensureAuth, ensureAdmin } = require('../middleware/auth');
const User = require('../models/User');



router.get('/', ensureAuth, async (req,res)=>{
  try {
    const user = req.session.user;
    if (user.role === 'Admin') {
      const allProjects = await Project.find().populate('grantedAccess requests createdBy','username email role');
      const users = await User.find({}, 'username email role');
      const pending = await Project.find({ requests: { $exists:true, $not: {$size:0} } }).populate('requests','username email role');
      return res.json({ success:true, projects: allProjects, users, pending });
    } else {
      const projects = await Project.find({ $or: [{ grantedAccess: user.id }, { createdBy: user.id }] });
      return res.json({ success:true, projects });
    }
  } catch (err) {
    res.status(500).json({ success:false, msg:err.message });
  }
});
router.post('/', ensureAuth, ensureAdmin, async (req, res) => {
  try {
    const { name, location, phone, email, startDate, endDate } = req.body;
    if (!name || !location || !phone || !email) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required"
      });
    }
    const { valid, errors } = validateProject({
      title: name,
      description: location,
      email,
      phone
    });
    if (!valid) {
      return res.status(400).json({
        success: false,
        msg: Object.values(errors)[0]
      });
    }
    const project = new Project({
      name,
      location,
      phone,
      email,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      createdBy: req.session.user.id
    });

    await project.save();

    res.json({ success: true, project });

  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});
router.post('/:id/request', ensureAuth, async (req,res)=>{
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success:false, msg:'Project not found' });
    const uid = req.session.user.id;
    if (project.requests.includes(uid) || project.grantedAccess.includes(uid)) {
      return res.json({ success:false, msg:'Already requested or granted' });
    }
    project.requests.push(uid);
    await project.save();
    res.json({ success:true, msg:'Request sent' });
  } catch (err) {
    res.status(500).json({ success:false, msg:err.message });
  }
});

router.post('/:id/approve', ensureAuth, ensureAdmin, async (req,res)=>{
  try {
    const { userId, action } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success:false, msg:'Project not found' });

    project.requests = project.requests.filter(r => r.toString() !== userId.toString());

    if (action === 'approve') {
      if (!project.grantedAccess.includes(userId)) project.grantedAccess.push(userId);
    }
    await project.save();
    res.json({ success:true, project });
  } catch (err) {
    res.status(500).json({ success:false, msg:err.message });
  }
});

router.get('/:id', ensureAuth, async (req,res)=>{
  try {
    const project = await Project.findById(req.params.id).populate('grantedAccess createdBy', 'username email role');
    if (!project) return res.status(404).json({ success:false, msg:'Project not found' });

    const user = req.session.user;
    if (user.role === 'Admin' || project.grantedAccess.map(String).includes(String(user.id)) || String(project.createdBy?._id) === String(user.id)) {
      return res.json({ success:true, project });
    }
    return res.status(403).json({ success:false, msg:'No access' });
  } catch (err) {
    res.status(500).json({ success:false, msg:err.message });
  }
});

module.exports = router;
