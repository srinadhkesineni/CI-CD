const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const router = express.Router();
const SECRET = 'ci_cd_jwt_secret_key';

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hash });
  await newUser.save();
  res.send('User registered!');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).send('Invalid credentials');

  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1d' });
  res.json({ token });
});

module.exports = router;
