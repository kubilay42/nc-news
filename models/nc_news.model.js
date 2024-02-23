const db = require("../db/connection");
const endpoints = require("../endpoints.json");

const selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then((data) => {
    console.log(data.rows)
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

const getArticles = (topic) => {
  let query = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
  COUNT(comment_id)::INT AS comment_count
  FROM articles LEFT JOIN comments
  ON comments.article_id = articles.article_id`;
  const values = [];
  if (topic) {
    query += ` WHERE topic = $1`;
    values.push(topic)
  }
  query += ` GROUP BY articles.article_id ORDER BY created_at DESC`;
  return db
    .query(query, values)
    .then((data) => {
      console.log(data.rows)
      if(data.rows === undefined){
        return Promise.reject({ status: 404, msg: "Topic not found" })
      }
      return data.rows;
    });
};

const getComment = (articleId) => {
  return db
    .query(`SELECT article_id FROM articles WHERE article_id = $1`, [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject();
      } else {
        return db.query(
          `SELECT * FROM comments 
           WHERE article_id = $1
           ORDER BY created_at DESC`,
          [articleId]
        );
      }
    })
    .then(({ rows }) => {
      return rows;
    });
};

const addComment = ({ username, body }, articleId) => {
  return db
    .query(
      `
  INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING *`,
      [username, body, articleId]
    )
    .then((result) => {
      return result.rows[0];
    });
};

const updateArticleVotes = (newVote, articleId) => {
  return db
    .query(
      `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`,
      [newVote, articleId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject();
      }
      return result.rows[0];
    });
};

const removeCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment does not exist" });
      }
      return result.rows;
    });
};
const getUsers = () => {
  return db
    .query(
      `SELECT *
  FROM users`
    )
    .then((data) => {
      return data.rows;
    });
};

module.exports = {
  selectTopics,
  getEndpoints,
  selectArticleById,
  getArticles,
  getComment,
  addComment,
  updateArticleVotes,
  removeCommentById,
  getUsers,
};
