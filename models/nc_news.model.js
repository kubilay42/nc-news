const db = require("../db/connection");

const selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then((data) => {
    return data.rows
  });
};

module.exports = {selectTopics}