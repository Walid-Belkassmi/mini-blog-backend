const fs = require("fs");
const slugify = require("slugify");

const ifCategorieExist = (req, res, next) => {
  const Slug = slugify(req.body.Name, { lower: true });
  fs.readFile("./categories.json", (err, data) => {
    if (err) {
      console.log(err);
      return;
    } else {
      const response = JSON.parse(data.toString());
      const categorieExist = response.find((res) => res.Slug === Slug);

      if (categorieExist) {
        res.status(409).json("Categorie exist");
      } else {
        req.categorie = { ...req.body, Slug };
        req.categories = response;
        next();
      }
    }
  });
};

module.exports = {
  ifCategorieExist,
};
