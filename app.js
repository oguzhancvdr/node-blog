const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const blogRoutes = require("./routes/blogRoutes");
require("dotenv").config();

//express app
const app = express();

// connect to mongodb
const { DB_USERNAME, DB_PASSWORD, DB_HOSTNAME, DB_NAME } = process.env;

const dbURI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOSTNAME}/${DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log("error: ", err));

//register view engine
app.set("view engine", "ejs");

//middleware & static files
app.use(express.static("public"));
//! to access data from form and body object inside of req
//! we need to below middleware
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//mongoose and mongo sandbox routes
{
  /* app.get("/add-blog", async (req, res) => {
  const blog = await new Blog({
    title: "new blog",
    snippet: "about my new blog",
    body: "more about my new blog",
  });

  await blog
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log("error: ", err);
    });
});

app.get("/all-blogs", async (req, res) => {
  await Blog.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/single-blog", async (req, res) => {
  await Blog.findById("5fcfff4fa92da507643f01b7")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
}); */
}

//routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

//blog routes
app.use("/blogs", blogRoutes);

//404 page
//! it'll fire every refresh so it should be at the very bottom
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
