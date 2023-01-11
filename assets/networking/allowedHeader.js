module.exports = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS);
    res.header('Access-Control-Allow-Headers', process.env.ALLOWED_HEADERS);
    res.header('Access-Control-Allow-Methods', process.env.ALLOWED_METHODS_X);
  
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', process.env.ALLOWED_METHODS);
      return res.status(200).json({});
    }
  
    next();
};