const express = require("express");
const app = express();
app.use(express.json());

const {
  getAllTopics,
  getAllEndpoints,
  getArticleById,
  getAllArticles,
  getCommentForArticle,
  addCommentById
} = require("../controllers/nc_news.controller");

app.get("/api", getAllEndpoints);
app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentForArticle)
app.post("/api/articles/:article_id/comments", addCommentById)

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Not found" });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).send({ msg: "Internal server error" });
  }
});

module.exports = app;
