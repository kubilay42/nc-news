const { selectTopics, getEndpoints,selectArticleById, getArticles } = require("../models/nc_news.model");

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
      res.status(200).send(endpoints);
    })
    .catch((err) => {
      next(err);
    });
}

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  selectArticleById(article_id)
  .then((article) => {
    res.status(200).send({article})
  })
  .catch((err) => {
    next(err)
  })
}

function getAllArticles(req, res, next) {
  getArticles()
  .then((articles) => {
    res.status(200).send({articles})
  })
  .catch((err) => {
    console.log(err)
    next(err)
  })
}

module.exports = { getAllTopics, getAllEndpoints, getArticleById, getAllArticles };
