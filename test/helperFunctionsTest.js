var expect = require("chai").expect;
var helperFunctions = require("../controllers/helperFunctions.js");

describe("pricing", function() {
  it("should return 'no data' when object.price_level is undefined", function() {
    expect(helperFunctions.pricing({test: 'test1'})).to.equal("No data");
  });

  it("should return the value of object.price_level when it is defined", function() {
    expect(helperFunctions.pricing({price_level: 9.99})).to.equal(9.99);
  });
 
})