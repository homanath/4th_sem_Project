module.exports = (req, res, next) => {
  if (req.user.role !== 'lawyer') {
    return res.status(403).json({ message: 'Access denied. Lawyer only.' });
  }
  next();
}; 