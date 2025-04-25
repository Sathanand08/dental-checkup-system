// routes/dentists.js
const express = require('express');
const router = express.Router();
const dentistController = require('../controllers/dentistController');
const { auth } = require('../middleware/auth');

router.get('/', auth, dentistController.getAllDentists);

module.exports = router;