const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

// TODO: logout router

module.exports = router;
