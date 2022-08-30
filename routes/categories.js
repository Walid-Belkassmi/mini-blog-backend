const express = require("express");
const app = express();
const fs = require("fs");
const file = "./data/categories.json";
const {
  checkIfExists,
  checkDoesNotExists,
} = require("../middlewares/categories");
const { body, validationResult } = require("express-validator");

// -> afficher les categories
//        -> get '/categories'
app.get("/", (req, res) => {
  fs.readFile(file, (err, data) => {
    if (err) {
      res.status(500).json("Internal server error");
    } else {
      const categories = JSON.parse(data.toString());
      res.json(categories);
    }
  });
});

// -> afficher une seule catégorie, qui renvoie aussi tous les articles correspondant
//        -> get '/categories/:slug'
//        -> middleware checkIfExists
app.get("/:slug", checkIfExists, (req, res) => {
  // Plus lisible
  const category = {
    name: req.category.name,
    slug: req.category.slug,
    description: req.category.description,
    articles: [],
  };
  // Deconstruction
  // const { name, slug, description }
  // const category = {
  //   name,
  //   slug,
  //   description,
  //   articles: []
  // }

  // Clone
  // const category = {
  //   ...req.category
  //   articles: []
  // }

  fs.readFile("./data/articles.json", (err, data) => {
    if (err) {
      res.status(500).json("Internal server error");
    } else {
      const articles = JSON.parse(data.toString());
      const filteredArticles = articles.filter(
        (article) => article.category === category.slug
      );
      category.articles = filteredArticles;

      res.json(category);
    }
  });
});

app.post(
  "/",
  body("name")
    .isLength({ min: 4 })
    .withMessage("Category name must be 4 chars minimum"),
  body("description")
    .isLength({ min: 20 })
    .withMessage("Category description must be 20 chars minimum"),
  checkDoesNotExists,
  (req, res) => {
    const { errors } = validationResult(req);
    console.log(errors);

    if (errors) {
      res.status(400).json(errors);
      return;
    }

    const category = {
      name: req.body.name,
      description: req.body.description,
      slug: req.categorySlug,
    };

    const categories = [...req.categories, category];

    fs.writeFile(file, JSON.stringify(categories), (err) => {
      if (err) {
        res.status(500).json("Internal server error");
      } else {
        res.json(category);
      }
    });
  }
);

module.exports = app;
