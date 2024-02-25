const request = require("supertest");
const app = require("../db/app.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");
const endpointsFile = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("CORE: GET /api/topics", () => {
  test("GET:200 should get an array of topic objects, each of which should have slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { topics } = response.body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
  test("GET:404 responds with an appropriate status and error message when provided a non existent endpoint", () => {
    return request(app)
      .get("/api/nonexistentendpoint")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
});

describe("CORE: GET /api", () => {
  test("GET: 200 should get a json object describing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const { endpoints } = response.body;
        expect(endpoints).toEqual(endpointsFile);
      });
  });
});

describe("CORE: GET /api/articles/:article_id", () => {
  test("should return an article object, which should have the article properties", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then((response) => {
        expect(response.body.article.article_id).toBe(4);
      });
  });

  test("should return an article object, which includes the comment count of that article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const {article} = response.body
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number)
        });
      });
  });
  test("GET:404 responds with an appropriate status and error message when provided a valid but non existing endpoint", () => {
    return request(app)
      .get("/api/articles/4444")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article Id not found");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test('should return all articles if no parameters passed in', () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            article_img_url: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  });

describe("CORE: GET /api/articles", () => {
  test("GET:200, should return all articles when no topic query is provided", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            article_img_url: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test('200: should filter articles by the topic value specified in the query', () => {
    return request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)
      .then((response) => {
        const {articles} = response.body
        expect(articles.length).toBe(12)
        articles.forEach(article => {
          expect(article.topic).toBe('mitch');
        });
      });
  });

  test("the articles should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test('404: should return an error when given a non-existent topic', () => {
    return request(app)
      .get('/api/articles?topic=notATopic')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Topic not found');
      });
  });
  test("GET:404 responds with an appropriate status and error message when provided a non existent endpoint", () => {
    return request(app)
      .get("/api/nonexistentendpoint")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  })
  test('GET:200, should return an empty array when given a valid topic query but has no artcles', () => {
    return request(app)
    .get("/api/articles?topic=paper")
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual( {articles: []})
    })
  });
});

describe("CORE: GET /api/articles/:article_id/comments", () => {
  test("GET: 200, should get all comments for an existing article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(11);

        const { comments } = response.body;
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("200: should return an empty array for an article that exists but has no comments", () => {
    const articleIdWithoutComments = 2;
    return request(app)
      .get(`/api/articles/${articleIdWithoutComments}/comments`)
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toEqual([]);
      });
  });
  test("Comments should be served with the most recent comments first. ", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const { comments } = response.body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET:404 responds with an appropriate status and error message when provided a valid but non existing article id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("GET:404 responds with an appropriate status and error message when provided a invalid endpoint", () => {
    return request(app)
      .get("/api/articles/1/invalid-endpoint")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
});

describe("CORE: POST /api/articles/:article_id/comments", () => {
  test("POST: 201, should insert a new comment by the article Id", () => {
    const newComment = {
      username: "rogersop",
      body: "This article needs some more comments",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const { comment } = response.body;
        expect(comment.article_id).toBe(5);
        expect(comment.author).toBe("rogersop");
        expect(comment.body).toBe("This article needs some more comments");
      });
  });
  test("POST: 201, should ignore unnecessary properties in the request body", () => {
    const newComment = {
      username: "rogersop",
      body: "This is a valid comment",
      unnecessaryProperty: "This should be ignored",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const { comment } = response.body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          author: "rogersop",
          body: "This is a valid comment",
        });
        expect(comment.unnecessaryProperty).toBe(undefined);
      });
  });
  test("POST:404 responds with an appropriate status and error message when provided a valid but non existing article id", () => {
    const newComment = {
      username: "rogersop",
      body: "This article needs some more comments",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("POST: 400, invalid article ID", () => {
    const newComment = {
      username: "rogersop",
      body: "This is a valid comment",
    };
    return request(app)
      .post("/api/articles/not-an-id/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("POST: 400, missing required field 'username'", () => {
    const newComment = {
      body: "This comment has no username",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("POST: 400, missing required field 'body'", () => {
    const newComment = {
      username: "rogersop",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("POST: 404, invalid username", () => {
    const newComment = {
      username: "nonexistentuser",
      body: "This is a valid comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });

  test("POST:404 responds with an appropriate status and error message when provided a non existing endpoint", () => {
    const newComment = {
      username: "rogersop",
      body: "This article needs some more comments",
    };
    return request(app)
      .post("/api/articles/5/non-existing-endpoint")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: should increment the article votes property and return the updtaed article", () => {
    const newVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then((response) => {
        expect(response.body.article).toMatchObject({
          article_id: 1,
          votes: expect.any(Number),
        });
        expect(response.body.article.votes).toBe(101);
      });
  });
  test("200: should decrease the article votes property and return the updated article", () => {
    const newVotes = {
      inc_votes: -100,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then((response) => {
        expect(response.body.article).toMatchObject({
          article_id: 1,
          votes: expect.any(Number),
        });
        expect(response.body.article.votes).toBe(0);
      });
  });
  test("400: should respond with bad request when given an invalid article id ", () => {
    const newVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/non-existing-id")
      .send(newVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("200: should give article object when inc_votes is missing", () => {
    const newVotes = {};
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then((response) => {
        expect(response.body.article).toMatchObject({ article_id: 1 });
      });
  });
  test("404 :should give appropriate error when article not found", () => {
    const newVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/999")
      .send(newVotes)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("400: should give error when inc_votes property is not a number", () => {
    const newVotes = { inc_votes: "not-a-number" };

    return request(app)
      .patch(`/api/articles/1`)
      .send(newVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
describe("CORE: DELETE /api/comments/:comment_id", () => {
  test("204: delete the given comment by comment_id. Sends nothing back.", () => {
    return request(app).delete("/api/comments/5").expect(204);
  });
  test("DELETE:404 responds with an appropriate status and error message when given a non-existent id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment does not exist");
      });
  });
  test("DELETE:400 responds with an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/not-a-comment")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
describe("CORE: GET /api/users", () => {
  test("GET:200, should return an array of users objects with properties of username, name and avatar url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const { users } = response.body;
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(4);
        users.forEach((user)=> {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
          })
        })
      });
  });
  test("GET:404 responds with an appropriate status and error message when provided a non existent endpoint", () => {
    return request(app)
      .get("/api/nonexistentendpoint")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
});