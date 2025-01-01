// Middleware to log and store request information
const requestLoggerMiddleware = (req, res, next) => {
  const requestInfo = {
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString(),
  };

  // Log the request info (for debugging or monitoring)
  console.log("Request Info:", requestInfo);
  next();
};

export default requestLoggerMiddleware;
