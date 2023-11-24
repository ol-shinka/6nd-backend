const loggerUrl = (request, response, next) => {
  console.log(request.method, request.originalUrl, request.body);
  next();
};

module.exports = loggerUrl;
