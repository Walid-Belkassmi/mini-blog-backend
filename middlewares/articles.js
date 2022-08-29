const fs = require("fs");
const moment = require("moment");
const slugify = require("slugify");

const ifArticleExist = (req, res, next) => {
  const { slug } = req.params;
  const Slug = slugify(req.body.Titre, { lower: true });
  fs.readFile("./articles.json", (err, data) => {
    if (err) {
      console.log(err);
      return;
    } else {
      const response = JSON.parse(data.toString());
      const articleExist = response.find((res) => res.Slug === Slug);

      if (articleExist) {
        res.status(409).json("article exist");
      } else {
        req.articles = response;
        req.article = {
          ...req.body,
          Slug,
          Date: moment().format(),
          Categorie: slug,
        };
      }

      next();
    }
  });
};

const ifCategorieExist = (req, res, next) => {
  const { slug } = req.params;
  fs.readFile("./categories.json", (err, data) => {
    if (err) {
      console.log(err);
      return;
    } else {
      const response = JSON.parse(data.toString());
      const categorieExist = response.find((res) => res.Slug === slug);
      if (categorieExist) {
        next();
      } else {
        res.status(404).json("Categorie not found");
      }
    }
  });
};

module.exports = {
  ifArticleExist,
  ifCategorieExist,
};
