const getUserByEmail = function(email, database) {
  // lookup magic...

  for (const objectKey of Object.keys(database)) {
    if (email === database[objectKey].email) {
      console.log("true");
      return database[objectKey];
    }
  }
  return false;
};

// function generateRandomString() {
//   let randomString = Math.random()
//     .toString(36)
//     .substring(2, 8);

//   return randomString;
// }

// function checkEmail(users, email) {
//   for (const objectKey of Object.keys(users)) {
//     if (email === users[objectKey].email) {
//       console.log("true");
//       return true;
//     }
//   }
//   return false;
// }

// function lookupEmail(users, email) {
//   for (const objectKey of Object.keys(users)) {
//     if (email === users[objectKey].email) {
//       console.log("true");
//       return users[objectKey];
//     }
//   }
//   return false;
// }

// function urlsForUser(id, urlDatabase) {
//   const result = {};
//   for (const updatedObj in urlDatabase) {
//     if (urlDatabase[updatedObj].userID === id) {
//       // ADD THE ENTIRE URLS OBJECT (urlDatabase[updatedObj]) INTO result

//       result[updatedObj] = urlDatabase[updatedObj];
//     }
//     // console.log(urlDatabase[updatedObj]);
//   }

//   console.log(result);
//   return result;
// }

// urlsForUser("aJ48lW");

module.exports = { getUserByEmail };
