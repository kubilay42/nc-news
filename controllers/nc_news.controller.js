const {
  selectTopics,
  getEndpoints,
  selectArticleById,
  getArticles,
  getComment,
  addComment,
  updateArticleVotes,
  removeCommentById,
  getUsers,
  
  
} = require("../models/nc_news.model");

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
      res.status(200).send( {article} );
    })
    .catch((err) => {
      next(err);
    });
}

function getAllArticles(req, res, next) {
  const { topic } = req.query;
  const validTopics = ['mitch','cats','paper']
  if(!topic){
    getArticles().then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
  }else if(topic && validTopics.includes(topic)){
    selectTopics()
    .then(getArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles })
    })
    .catch((err) => {
      next(err);
    })
    )}else{return Promise.reject({ status: 404, msg: "Topic not found" })
      .catch((err) => {
        next(err)})}
  }
  
function getCommentForArticle(req, res, next) {
  const { article_id } = req.params;
  getComment(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}
function addCommentById(req, res, next) {
  const newComment = req.body;
  const { article_id } = req.params;
  addComment(newComment, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
}
function updateArticles(req, res, next) {
  const newVote = req.body.inc_votes;
  const { article_id } = req.params;
  if (newVote === undefined) {
    selectArticleById(article_id)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch((err) => {
        console.log(err)
        next(err);
      });
  }
  updateArticleVotes(newVote, article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}
function deleteCommentById(req, res, next) {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
}
function getAllUsers(req, res, next) {
  getUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => next(err));
}

module.exports = {
  getAllTopics,
  getAllEndpoints,
  getArticleById,
  getAllArticles,
  getCommentForArticle,
  addCommentById,
  updateArticles,
  deleteCommentById,
  getAllUsers,
};
