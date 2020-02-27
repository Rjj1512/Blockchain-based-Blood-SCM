const Hospital = artifacts.require("Hospital");

module.exports = function(deployer) {
  deployer.deploy(Hospital);
};