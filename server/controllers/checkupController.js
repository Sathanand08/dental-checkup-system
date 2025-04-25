const Checkup = require('../models/Checkup');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
}).array('images', 5);

exports.uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

exports.requestCheckup = async (req, res) => {
  try {
    const { dentistId } = req.body;
    const patientId = req.user.id;
    
    const checkup = new Checkup({
      patient: patientId,
      dentist: dentistId,
      status: 'requested'
    });
    
    await checkup.save();
    res.status(201).json(checkup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPatientCheckups = async (req, res) => {
  try {
    const patientId = req.user.id;
    
    const checkups = await Checkup.find({ patient: patientId })
      .populate('dentist', 'name email')
      .sort('-createdAt');
      
    res.json(checkups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDentistCheckups = async (req, res) => {
  try {
    const dentistId = req.user.id;
    
    const checkups = await Checkup.find({ dentist: dentistId })
      .populate('patient', 'name email')
      .sort('-createdAt');
      
    res.json(checkups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCheckup = async (req, res) => {
  try {
    const { checkupId } = req.params;
    const { notes, descriptions } = req.body;
    const dentistId = req.user.id;
    
    const checkup = await Checkup.findById(checkupId);
    
    if (!checkup) {
      return res.status(404).json({ message: 'Checkup not found' });
    }
    
    if (checkup.dentist.toString() !== dentistId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file, index) => ({
        path: file.path,
        description: descriptions && descriptions[index] ? descriptions[index] : ''
      }));
      
      checkup.images = images;
    }
    
    if (notes) {
      checkup.notes = notes;
    }
    
    checkup.status = 'completed';
    await checkup.save();
    
    res.json(checkup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCheckupDetails = async (req, res) => {
  try {
    const { checkupId } = req.params;
    
    const checkup = await Checkup.findById(checkupId)
      .populate('dentist', 'name email')
      .populate('patient', 'name email');
      
    if (!checkup) {
      return res.status(404).json({ message: 'Checkup not found' });
    }
    
    res.json(checkup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};