// routes/checkups.js
const express = require('express');
const router = express.Router();
const checkupController = require('../controllers/checkupController');
const { auth, dentistOnly, patientOnly } = require('../middleware/auth');

// Patient routes
router.post('/request', auth, patientOnly, checkupController.requestCheckup);
router.get('/patient', auth, patientOnly, checkupController.getPatientCheckups);

// Dentist routes
router.get('/dentist', auth, dentistOnly, checkupController.getDentistCheckups);
router.put('/:checkupId', auth, dentistOnly, checkupController.uploadMiddleware, checkupController.updateCheckup);

// Common routes
router.get('/:checkupId', auth, checkupController.getCheckupDetails);

module.exports = router;