const express = require("express");
const app = express();
const fs = require("fs");
const moment = require("moment");
const { body, validationResult } = require("express-validator");
const {
  checkIfExists,
  checkIfNotExist,
  checkIfCategoryIsValid,
} = require("../middlewares/articles");
const file = "./data/articles.json";

app.get("/", (req, res) => {
  fs.readFile(file, (err, data) => {
    if (err) {
      res.status(500).json("Internal server error");
    } else {
      const articles = JSON.parse(data.toString());
      res.json(articles);
    }
  });

  // stynaxe promise
  // try {
  //   const data = await fs.readFile('./data/articlses.json')
  //   const articles = JSON.parse(data.toString())
  //   res.json(articles)
  // } catch (e) {
  //   console.log(e)
  //   res.status(500).json('Internal server error')
  // }
});

app.get("/:slug", checkIfExists, (req, res) => {
  res.json(req.article);
});

app.post(
  "/",
  body("title")
    .isLength({ min: 2, max: 60 })
    .withMessage("Title must be between 2 and 60 chars"),
  body("author").isString().withMessage("Invalid author name"),
  body("description")
    .isString()
    .isLength({ min: 100, max: 1000 })
    .withMessage("Description must be between 100 and 1000 chars"),
  checkIfNotExist,
  checkIfCategoryIsValid,
  (req, res) => {
    const { errors } = validationResult(req);

    if (errors.length > 0) {
      res.status(400).json(errors);
      return;
    }

    fs.readFile(file, (err, data) => {
      if (err) {
        res.status(500).json("Internal server error");
      } else {
        const articles = JSON.parse(data.toString());

        const article = {
          ...req.body,
          slug: req.articleSlug,
          date: moment().format(),
        };

        articles.push(article);

        fs.writeFile(file, JSON.stringify(articles), (err) => {
          if (err) {
            res.status(500).json("Internal server error");
          } else {
            res.json(article);
          }
        });
      }
    });
  }
);

module.exports = app;
