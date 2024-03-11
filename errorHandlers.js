exports.notFound = ("/*", (req, res, next) => {
    res.status(404).send({ msg: "Not found" })
    next(err);
  })
  
  // General Error
  exports.generalError = (err, req, res, next) => {
    res.status(err.status || 500).send({
      error: {
        message: err.message || 'Internal Server Error',
      },
    });
  };

