const express = require('express');
const router = express.Router();
const { createUser, checkUser } = require('../controllers/user');
const User = require('../models/User');

router.post('/signup', async (req,res)=>{
  try {
    const { username, email, password, role } = req.body;
    const created = await createUser(username, password, email, role);
    res.json({ success:true, user: created, msg:'User created' });
  } catch (err) {
    res.status(400).json({ success:false, msg: err.message });
  }
});

router.post('/login', async (req,res)=>{
  try {
    const { username, password } = req.body;
    const user = await checkUser(username, password);
    req.session.user = user;
    res.json({ success:true, user });
  } catch (err) {
    res.status(401).json({ success:false, msg: err.message });
  }
});

router.post('/logout', (req,res)=>{
  req.session.destroy(err => {
    if (err) return res.status(500).json({ success:false, msg:'Logout error' });
    res.clearCookie('connect.sid');
    res.json({ success:true, msg:'Logged out' });
  });
});

module.exports = router;
