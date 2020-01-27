const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const cookieSession = require("cookie-session");
const { getUserByEmail } = require("./helpers");
// const { lookupEmail } = require("./getUserByEmail");

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
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  kfTft4: { longURL: "https://www.reddit.com", userID: "4safse" }
};

app.get("/", (req, res) => {
  // res.send("Hello you are at David He's Tiny App Project!");

  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    res.redirect("/urls"); //urls_new page is rendered when the endpoint of new is implemented in browser
  }
  // res.redirect("/login");
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
    urls: urlsForUser(req.session.user_id, urlDatabase),
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
    res.render("urls_new", templateVars); //urls_new page is rendered when the endpoint of new is implemented in browser
  }
});

app.get("/urls/:shortURL", (req, res) => {
  console.log(req);

  if (!req.session.user_id) {
    res.redirect("/login");
    return;
  }

  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.session.user_id
  };
  res.render("urls_show", templateVars); //urls_show page is rendered when the endpoint of shortURL is implemented in browser
});

app.get("/u/:shortURL", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
    return;
  }

  longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
  return;
});

app.get("/register", (req, res) => {
  let templateVars = {
    username: undefined
  };

  res.render("user_registration", templateVars); //user_registration page is rendered when the endpoint of register is implemented in browser
});

app.get("/login", (req, res) => {
  let templateVars = {
    username: undefined
  };

  res.render("user_login", templateVars); //user_login page is rendered when the endpoint of register is implemented in browser
});

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = generateRandomString();

  urlDatabase[shortURL] = { longURL, userID: req.session.user_id };
  console.log(shortURL);

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

  res.redirect("/urls/"); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id", (req, res) => {
  let longURL = req.body.longURL;
  urlDatabase[req.params.id].longURL = longURL;

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
    res.end("Status code 400 (fields are empty)"); //when user registers error message shows up if email and password not inputted
  } else if (checkEmail(users, email)) {
    res.statusCode = 400;
    res.end("Status code 400 (emails are inside object)"); //when user registers the same username and password that had previously been registered, this error message shows up
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

  req.session.user_id = req.body.email;

  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  console.log(users);

  console.log("line 215 ---> ", lookupEmail(users, req.body.email));
  if (req.body.email === "" || req.body.password === "") {
    res.statusCode = 403;
    res.end("Status code 403 (both the e-mail and password cannot be found)"); //if user does not type in a username and password in the login page, after an account has been registered the message "Status code 403 (both the e-mail and password cannot be found)" is displayed"
  } else {
    const user = lookupEmail(users, req.body.email);
    if (!user) {
      res.statusCode = 403;
      res.end(
        "Sorry we do not recognize this username. User not found! Please try again!"
      ); //if user types in the wrong username in the login page, after an account has been registered the message "User not found!" is displayed"
    } else {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        req.session.user_id = req.body.email;
        res.redirect("/urls");
      } else {
        res.statusCode = 403;
        res.end(
          "Invalide password, please try again. Password is case sensitive."
        ); //if user inputs the wrong password in the login page, the message "Password incorrect!" is displayed"
      }
    }
  }
});

function generateRandomString() {
  let randomString = Math.random()
    .toString(36)
    .substring(2, 8);

  return randomString;
}

function checkEmail(users, email) {
  //function checkEmail is used to compare the email in users object with email inputted by the user.
  for (const objectKey of Object.keys(users)) {
    if (email === users[objectKey].email) {
      console.log("true");
      return true;
    }
  }
  return false;
}

function lookupEmail(users, email) {
  //function lookupEmail is used to compare the email in users object with email inputted by the user and returns email stored in object
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
      result[updatedObj] = urlDatabase[updatedObj];
    }
  }

  console.log(result);
  return result;
}
