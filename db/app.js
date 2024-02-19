const express = require("express");
const app = express();
const {getAllTopics} = require("../controllers/nc_news.controller")


app.get('/api/topics', getAllTopics)

app.all("/api/*", (req, res, next) => {
    res.status(404).send({ msg:"Not found" })
    .next(err)
})

app.use((err, req, res, next)=> {
    if (err){
      res.status(500).send({msg:"Internal server error"})
      }
    })
  

module.exports= app