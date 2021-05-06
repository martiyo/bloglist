const logger = require("./logger");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const unknowEndpoint = (request, response) => {
  response.status(404).send({ error: "unknow endpoint" });
};

const errorHandler = (error, request, response, next) => {
  //console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebtokenError") {
    return response.status(401).json({
      error: "invalid token",
    });
  }
  logger.error(error.message);

  next(error);
};

module.exports = {
  requestLogger,
  unknowEndpoint,
  errorHandler,
};
