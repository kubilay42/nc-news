const db = require("../db/connection");
const endpoints = require("../endpoints.json");

const selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then((data) => {
    return data.rows;
  });
};

const getEndpoints = () => {
  return Promise.resolve({ endpoints });
};

const selectArticleById = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then((article) => {
      if (article.rows[0] === undefined) {
        return Promise.reject();
      }
      return article.rows[0];
    });
};
module.exports = { selectTopics, getEndpoints, selectArticleById };
