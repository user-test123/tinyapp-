const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL] /* What goes here? */
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  //get shortURL from request
  //use shortURL to retrieve the asscoaited long url
  //redirect user to website of longURL

  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = generateRandomString();
  // console.log(req.body.longURL); // Log the POST request body to the console
  console.log(longURL);
  console.log(shortURL);
  urlDatabase[shortURL] = longURL;
  console.log(urlDatabase);
  res.redirect("urls/" + shortURL); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];

  console.log(urlDatabase[req.params.shortURL]);
  // expected output: "wwww.lighthouse.com"

  res.redirect("/urls/"); // Respond with 'Ok' (we will replace this)
});

// app.post("/urls/:shortURL/edit", (req, res) => {
//   delete urlDatabase[req.params.shortURL];

//   // console.log(urlDatabase[req.params.shortURL]);
//   // expected output: "wwww.lighthouse.com"

//   res.redirect("/urls/"); // Respond with 'Ok' (we will replace this)
// });

app.post("/urls/:id", (req, res) => {
  let longURL = req.body.longURL;
  urlDatabase[req.params.id] = longURL;

  console.log(urlDatabase[req.params.id]);
  // expected output: "wwww.lighthouse.com"

  res.redirect("/urls/"); // Respond with 'Ok' (we will replace this)
});

function generateRandomString() {
  let randomString = Math.random()
    .toString(36)
    .substring(2, 8);

  return randomString;
}
