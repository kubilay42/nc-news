const { selectTopics } = require("../models/nc_news.model");

function getAllTopics(req, res, next) {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  })
  .catch((err) => {
    next(err)
  })
}
module.exports = { getAllTopics };
