const { selectTopics, getEndpoints} = require("../models/nc_news.model");

function getAllTopics(req, res, next) {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
}

function getAllEndpoints(req, res, next) {
  getEndpoints()
  .then((endpoints) => {
    res.status(200).send( endpoints )
  })
  .catch((err) => {
      next(err);
    });
}

module.exports = { getAllTopics ,getAllEndpoints};
