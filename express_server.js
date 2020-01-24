const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
var cookieSession = require("cookie-session");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"]
  })
);

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
    cookieID: "user_id"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "a@a.com",
    password: "123"
  }
};

app.set("view engine", "ejs");

const urlDatabase = {
  // b2xVn2: "http://www.lighthouselabs.ca",
  // "9sm5xK": "http://www.google.com"

  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  kfTft4: { longURL: "https://www.reddit.com", userID: "4safse" }
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
  // console.log(urlDatabase);

  // console.log(users);
  let username = undefined;
  if (req.session.user_id) {
    username = req.session.user_id;
  } else {
    res.redirect("/login");
    return;
  }

  let templateVars = {
    urls: urlsForUser(req.session.user_id),
    // id: undefined,

    username
  };

  // console.log(typeof req.cookies["user_id"]);
  // console.log(req.cookies["user_id"] === undeffined);
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    let templateVars = {
      username: req.session.user_id,
      email: req.session.user_id
    };
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  console.log(req);
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL] /* What goes here? */,
    username: req.session.user_id
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  //get shortURL from request
  //use shortURL to retrieve the asscoaited long url
  //redirect user to website of longURL

  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect("/longURL");
});

app.get("/register", (req, res) => {
  // console.log(users);
  // const password = "purple-monkey-dinosaur";
  // const hashedPassword = bcrypt.hashSync(password, 10);

  let templateVars = {
    username: undefined
  };

  res.render("user_registration", templateVars);
});

app.get("/login", (req, res) => {
  // console.log(users);
  let templateVars = {
    username: undefined
  };

  res.render("user_login", templateVars);
});

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = generateRandomString();

  // console.log(req.body.longURL); // Log the POST request body to the console
  // console.log(longURL);
  // console.log(shortURL);
  urlDatabase[shortURL] = { longURL, userID: req.session.user_id };
  console.log(shortURL);
  // console.log(urlDatabase);
  res.redirect("urls/" + shortURL); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];

  console.log(urlDatabase[req.params.shortURL]);
  // expected output: "wwww.lighthouse.com"

  res.redirect("/urls/"); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL/edit", (req, res) => {
  delete urlDatabase[req.params.shortURL];

  // console.log(urlDatabase[req.params.shortURL]);
  // expected output: "wwww.lighthouse.com"

  res.redirect("/urls/"); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id", (req, res) => {
  let longURL = req.body.longURL;
  urlDatabase[req.params.id].longURL = longURL;

  // console.log(urlDatabase[req.params.id]);
  // expected output: "wwww.lighthouse.com"

  res.redirect("/urls/"); // Respond with 'Ok' (we will replace this)
});

app.post("/logout", (req, res) => {
  console.log("logout test");
  req.session = null;
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (email === "" && password === "") {
    res.statusCode = 400;
    res.end("Status code 400 (fields are empty)");
  } else if (checkEmail(users, email)) {
    res.statusCode = 400;
    res.end("Status code 400 (emails are inside object)");
  }

  let randomID = generateRandomString();

  users[randomID] = {
    id: randomID,
    email: req.body.email,
    password: undefined
  };
  const hashedPassword = bcrypt.hashSync(password, 10);

  console.log(users[randomID]);
  users[randomID].password = hashedPassword;
  console.log(hashedPassword);

  // users[randomID] = user;

  // console.log(users);

  // console.log(req.body.email);
  // console.log(req.body.password);
  // console.log("register test");

  req.session.user_id = req.body.email;

  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  // console.log(req.body.username);
  console.log(users);

  console.log("line 215 ---> ", lookupEmail(users, req.body.email));
  if (req.body.email === "" || req.body.password === "") {
    res.statusCode = 403;
    res.end("Status code 403 (both the e-mail and password cannot be found)");
  } else {
    const user = lookupEmail(users, req.body.email);
    if (!user) {
      res.statusCode = 403;
      res.end("User not found!");
    } else {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        req.session.user_id = req.body.email;
        res.redirect("/urls");
      } else {
        res.statusCode = 403;
        res.end("Password incorrect!");
      }
    }
  }

  // let userid = "";
  // for (const user of Object.keys(users)) {
  //   if (users[user].email === req.body.email) {
  //     userid = user;
  //   }
  // }

  // console.log(req.body.password);
  // console.log(users[userid].password);
  // bcrypt.compareSync(req.body.password, users[userid].password);

  // } else if (user && user.password !== req.body.password) {
  //   res.statusCode = 403;
  //   res.end("Status code 403 (emails are inside object)");
  // } else if (!lookupEmail(users, req.body.email) && req.body.password) {
  //   res.statusCode = 403;
  //   res.end("Status code 403 (emails are inside object)");
  // } else if (lookupEmail(users, req.body.email) && req.body.password) {
  //   res.cookie("user_id", req.body.email);
  //   res.redirect("/urls");
  // }

  // let userRandomId = generateRandomString();
  // req.cookies["user_id"] = userRandomId;

  // if (lookupEmail(users, req.body.email) && req.body.password) {
  // if (lookupEmail(users, req.body.email) && req.body.password) {
  // (lookupEmail(users, req.body.email) && req.body.password) {
  // } else {
  //   res.cookie("user_id", req.body.email);
  // {
  //   res.redirect("/urls");
  //   let userRandomId = generateRandomString();
  //   req.cookies["user_id"] = userRandomId;
  // }

  // res.cookie("user_id", req.body.email);

  // res.redirect("/urls");
});

// app.post("/login", (req, res) => {
//   res.cookie("user_id", req.body.email);
//   res.redirect("/urls");
// });

function generateRandomString() {
  let randomString = Math.random()
    .toString(36)
    .substring(2, 8);

  return randomString;
}

function checkEmail(users, email) {
  for (const objectKey of Object.keys(users)) {
    if (email === users[objectKey].email) {
      console.log("true");
      return true;
    }
  }
  return false;
}

function lookupEmail(users, email) {
  for (const objectKey of Object.keys(users)) {
    if (email === users[objectKey].email) {
      console.log("true");
      return users[objectKey];
    }
  }
  return false;
}

function urlsForUser(id) {
  const result = {};
  for (const updatedObj in urlDatabase) {
    if (urlDatabase[updatedObj].userID === id) {
      // ADD THE ENTIRE URLS OBJECT (urlDatabase[updatedObj]) INTO result

      result[updatedObj] = urlDatabase[updatedObj];
    }
    // console.log(urlDatabase[updatedObj]);
  }

  console.log(result);
  return result;
}

urlsForUser("aJ48lW");
