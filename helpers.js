const getUserByEmail = function(email, database) {
  // lookup magic...

  for (const objectKey of Object.keys(database)) {
    //used in testing to compare the email located in the database with the meial inputted
    if (email === database[objectKey].email) {
      console.log("true");
      return database[objectKey]; //returns email if it matches
    }
  }
  return false; //returns fales if emails do not match
};

module.exports = { getUserByEmail };
