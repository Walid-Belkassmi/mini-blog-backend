const express = require("express");
const app = express();
const fs = require("fs");
const { ifArticleExist, ifCategorieExist } = require("../middlewares/articles");
const { body, validationResult } = require("express-validator");

app.get("/", (req, res) => {
  fs.readFile("./articles.json", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const response = JSON.parse(data.toString());

      res.json(response);
    }
  });
});

app.get("/:slug", ifCategorieExist, (req, res) => {
  const { slug } = req.params;
  fs.readFile("./articles.json", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const response = JSON.parse(data.toString());
      const articles = response.filter((article) => article.Categorie === slug);
      res.json(articles);
    }
  });
});

app.post(
  "/:slug",
  body("Auteur").exists().withMessage("missing Author"),
  body("Titre")
    .isLength({ min: 6, max: 20 })
    .withMessage("Incorrect length, min 6 and max 20"),
  body("Description").exists().withMessage("Missing description"),
  ifCategorieExist,
  ifArticleExist,
  (req, res) => {
    const { errors } = validationResult(req);

    if (errors.length > 0) {
      res.status(400).json(errors);
    } else {
      req.articles.push(req.article);
      fs.writeFile("./articles.json", JSON.stringify(req.articles), (err) => {
        console.log(err);
      });
      res.json("ok");
    }
  }
);

module.exports = app;
