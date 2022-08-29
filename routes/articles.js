const express = require("express");
const fs = require("fs");
const app = express();

app.get("/", (req, res) => {
  fs.readFile("./articles.json", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      //data brut
      const rawData = data;

      //data en mode string
      const stringifiedData = rawData.toString();

      //data en mode javascript
      const realData = JSON.parse(stringifiedData);

      res.json(data);
    }
  });
});

module.exports = app;
