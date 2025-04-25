const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.dentistOnly = (req, res, next) => {
  if (req.user.role !== 'dentist') {
    return res.status(403).json({ message: 'Access denied. Dentists only.' });
  }
  next();
};

exports.patientOnly = (req, res, next) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ message: 'Access denied. Patients only.' });
  }
  next();
};