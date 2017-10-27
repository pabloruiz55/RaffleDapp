//var ConvertLib = artifacts.require("./ConvertLib.sol");
//var MetaCoin = artifacts.require("./MetaCoin.sol");
//var Raffle = artifacts.require("./Raffle.sol");
var RaffleFactory = artifacts.require("./RaffleFactory.sol");

module.exports = function(deployer) {
  //deployer.deploy(ConvertLib);
  //deployer.link(ConvertLib, MetaCoin);
  //deployer.deploy(Raffle);
  deployer.deploy(RaffleFactory);
};
