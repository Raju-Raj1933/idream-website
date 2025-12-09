module.exports = (req, res, next) => {
  const user = req.session?.user ? `${req.session.user.username} (${req.session.user.role})` : 'Guest';
  console.log(`[Activity] ${new Date().toISOString()} - ${user} - ${req.method} ${req.originalUrl}`);
  next();
};
