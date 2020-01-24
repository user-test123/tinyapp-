const { assert } = require("chai");
const { getUserByEmail } = require("../helpers.js");

const testUsers = {
  //the database that was used during testing
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe("getUserByEmail", function() {
  //used "describe" function as well is "it" function to perform test cases
  it("should return a user with valid email", function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";

    assert.equal(user.id, expectedOutput);
    // Write your assert statement here
  });

  it("should return undefined for a non-existent email", function() {
    const user = getUserByEmail("user123@example.com", testUsers);
    assert.equal(user.id, undefined);
  });
});
