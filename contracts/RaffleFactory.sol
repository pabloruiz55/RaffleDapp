pragma solidity ^0.4.4;
import './Raffle.sol';

contract RaffleFactory{

  address[] rafflesArray;
  mapping (address => Raffle) rafflesMapping;

  mapping (address => address[]) userRaffles;
  mapping (address => address[]) rafflesJoinedByUser;

  event RaffleCreated(address raffleAddress, address indexed raffleOrganizer);

  function startRaffle(uint8 _min, uint8 _max){
    //Raffle l = new Raffle(msg.sender,_min,_max);
    Raffle l = new Raffle(msg.sender,_min,_max);

    //Array of Raffles
    rafflesArray.push(address(l));

    // Mapping of Raffle with address key
    rafflesMapping[address(l)] = l;

    // Mapping of array of Raffle addresses user as key (array of raffles this user created)
    userRaffles[msg.sender].push(address(l));
    // Mapping of mapping of Raffle user as key (mapping of raffles this user created)
    //userRafflesObj[msg.sender][address(l)]=l;

    RaffleCreated(address(l),msg.sender);
  }

  function getRafflesCreated() constant returns (address[]){
    return rafflesArray;
  }

  ///////////////////////////////////
  //Get user raffles and data ///////
  ///////////////////////////////////

  //1. First, get the array with raffles created by user or joined by user

  function getUserRaffles() constant returns (address[]){
    return userRaffles[msg.sender];
  }

  function getRafflesJoinedByUser() constant returns (address[]){
    return rafflesJoinedByUser[msg.sender];
  }

  //2. Then we'll traverse the array on the front-end
  //and retrieve the data for each one from the mapping containing the data

  function getRaffleData(address _raffle) constant returns (address,uint8,uint8){

    Raffle l = rafflesMapping[_raffle];
    return (address(l),l.getMinParticipants(),l.getMaxParticipants());
  }

  /////////////////////////////////////

  function joinRaffle(address _raffle) {
    Raffle l = rafflesMapping[_raffle];
    rafflesJoinedByUser[msg.sender].push(address(l));
    l.joinRaffle(msg.sender);
  }

}
