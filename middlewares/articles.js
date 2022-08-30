const fs = require("fs");
const slugify = require("slugify");

const file = "./data/articles.json";

const checkIfExists = (req, res, next) => {
  const { slug } = req.params;

  fs.readFile(file, (err, data) => {
    if (err) {
      res.status(500).json("Internal server error");
    } else {
      const articles = JSON.parse(data.toString());
      const article = articles.find((article) => article.slug === slug);

      if (article) {
        req.article = article;
        next();
      } else {
        res.status(404).json("Article not found");
      }
    }
  });
};

const checkIfNotExist = (req, res, next) => {
  const slug = slugify(req.body.title, { lower: true });

  fs.readFile(file, (err, data) => {
    if (err) {
      res.status(500).json("Internal server error");
    } else {
      const articles = JSON.parse(data.toString());
      const article = articles.find((article) => article.slug === slug);

      if (!article) {
        req.articleSlug = slug;
        next();
      } else {
        res.status(409).json("Article already exists");
      }
    }
  });
};

const checkIfCategoryIsValid = (req, res, next) => {
  const categorySlug = req.body.category;

  fs.readFile("./data/categories.json", (err, data) => {
    if (err) {
      res.status(500).json("Internal server error");
    } else {
      const categories = JSON.parse(data.toString());
      const category = categories.find(
        (category) => category.slug === categorySlug
      );

      if (category) {
        next();
      } else {
        res.status(404).json("Category not found");
      }
    }
  });
};

// middleware checkDoesNotExists, checkCategoryValid

module.exports = {
  checkIfExists,
  checkIfNotExist,
  checkIfCategoryIsValid,
};
