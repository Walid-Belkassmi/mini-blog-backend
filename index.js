const express = require("express");
const app = express();
const port = 5000;
const articlesRoutes = require("./routes/articles");

app.use(express.json());

app.use("/articles", articlesRoutes);

app.listen(port, (req, res) => {
  console.log(`Server running on port ${port}`);
});
