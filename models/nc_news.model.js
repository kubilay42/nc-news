const db = require("../db/connection");
const endpoints = require("../endpoints.json")

const selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then((data) => {
    return data.rows
  });
};

const getEndpoints = () => {
  return Promise.resolve({endpoints})
}

module.exports = {selectTopics, getEndpoints}