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
  test("GET:404 responds with an appropriate status and error message when provided a valid but non existing endpoint ", () => {
    return request(app)
      .get("/api/articles/4444")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
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
});
