const express = require('express');
const router = express.Router();
const checkupController = require('../controllers/checkupController');
const { auth, dentistOnly, patientOnly } = require('../middleware/auth');

router.post('/request', auth, patientOnly, checkupController.requestCheckup);
router.get('/patient', auth, patientOnly, checkupController.getPatientCheckups);

router.get('/dentist', auth, dentistOnly, checkupController.getDentistCheckups);
router.put('/:checkupId', auth, dentistOnly, checkupController.uploadMiddleware, checkupController.updateCheckup);

router.get('/:checkupId', auth, checkupController.getCheckupDetails);

module.exports = router;