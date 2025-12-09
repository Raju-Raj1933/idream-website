const bcrypt = require('bcrypt');
const User = require('../models/User');
const { validateRegister, validateLogin } = require("../utils/validators");

async function createUser(username, password, email, role = 'Client') {
  const { valid, errors } = validateRegister({ name: username, email, password });
  if (!valid) {
    throw new Error(Object.values(errors)[0]); 
  }
  const existing = await User.findOne({ username });
  if (existing) throw new Error('Username already exists');
  const hash = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    passwordHash: hash,
    role
  });
  await user.save();
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  };
}

async function checkUser(username, password) {
  const { valid, errors } = validateLogin({ email: username, password });
  if (!valid) {
    throw new Error(Object.values(errors)[0]);
  }
  const user = await User.findOne({ username });
  if (!user) throw new Error('User not found');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error('Invalid credentials');
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  };
}

module.exports = { createUser, checkUser };
