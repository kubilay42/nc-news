const request = require("supertest");
const app = require("../db/app.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");


beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("CORE: GET /api/topics", () => {
  test("should get an array of topic objects, each of which should have slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { topics } = response.body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
            expect(topic).toMatchObject({
              description: expect.any(String),
              slug: expect.any(String)
            });
          });
      });
  })
  test("GET:404 responds with an appropriate status and error message when provided a non existent endpoint", () => {
    return request(app)
    .get("/api/nonexistentendpoint")
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('Not found');
    })
  });
});
