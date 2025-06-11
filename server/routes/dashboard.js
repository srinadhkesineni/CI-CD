const express = require('express');
const jwt = require('jsonwebtoken');
const SECRET = 'ci_cd_jwt_secret_key';

const router = express.Router();

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token missing');

  jwt.verify(token.split(' ')[1], SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Invalid token');
    req.userId = decoded.id;
    next();
  });
}

router.get('/', verifyToken, (req, res) => {
  res.send(`Welcome to your dashboard, user ${req.userId}`);
});

module.exports = router;
