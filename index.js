const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const port = 5000;

const articlesRoutes = require("./routes/articles");
const categoriesRoutes = require("./routes/categories");

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.use("/articles", articlesRoutes);
app.use("/categories", categoriesRoutes);

app.listen(port, (req, res) => {
  console.log(`Server running on port ${port}`);
});
