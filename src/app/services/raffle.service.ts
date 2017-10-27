import { Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
const Web3 = require('web3');
const contract = require('truffle-contract');
const raffleArtifacts = require('../../../build/contracts/Raffle.json');
const raffleFactoryArtifacts = require('../../../build/contracts/RaffleFactory.json');

declare var window: any;

@Injectable()
export class RaffleService {

  Raffle = contract(raffleArtifacts);
  RaffleFactory = contract(raffleFactoryArtifacts);
  raffleInstance:any;
  raffleFactoryInstance:any;

  // TODO add proper types these variables
  account: any;
  accounts: any;
  web3: any;
  web3LoadedEvent: any;
  web3LoadedObserver: any;

  contractOwner:string;

  canSignETHTransactions:boolean = false;
  setupComplete = false;

  processingTransaction:boolean = false;

  constructor() {
    this.web3LoadedEvent = new Observable(observer => {
      this.web3LoadedObserver = observer;
    });
    this.checkAndInstantiateWeb3();
  }

  checkAndInstantiateWeb3 = () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      console.warn(
        'Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
      this.canSignETHTransactions = true;
    } else {
      console.warn(
        'No web3 detected, falling back to Infura Ropsten'
        //'No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(
        //new Web3.providers.HttpProvider('http://localhost:8545')
        new Web3.providers.HttpProvider('https://ropsten.infura.io/kUB300IO3nUP3tXCxG6P')

      );
    }
    this.onReady();
  };

  onReady = () => {
    // Bootstrap the MetaCoin abstraction for Use.
    this.Raffle.setProvider(this.web3.currentProvider);
    this.RaffleFactory.setProvider(this.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert('There was an error fetching your accounts.');
        return;
      }

      if (accs.length === 0) {
        alert(
          'You are not connected to an Ethereum client. You can still browse the data, but you will not be able to perform transactions.'
        );
        return;
      }
      this.accounts = accs;
      this.account = this.accounts[0];

      this.getRaffleFactoryInstance();

    });

  };

  //APP functions
  //Getting a reference of the crowdsale and coin contracts for later easier access.
  getRaffleInstance(){
    this.Raffle
    .deployed()
    .then(instance =>{
      //Set the ref for the contract and look up it's associated token
      this.raffleInstance = instance;

      //this.setupEventListeners();
    })
    .catch(e => {
      console.log("ERR",e);
    });
  }
  getRaffleInstanceAt(address:string) :Promise<any>{
    return this.Raffle
    .at(address)
    .then(instance =>{
      //Set the ref for the contract and look up it's associated token
      this.raffleInstance = instance;
      return new Promise((resolve, reject)=>{
        resolve(true);
      });

    })
    .catch(e => {
      console.log("ERR",e);
    });
  }

  getRaffleFactoryInstance() :Promise<any>{
    return this.RaffleFactory
    .deployed()
    .then(instance =>{
      //Set the ref for the contract and look up it's associated token
      this.raffleFactoryInstance = instance;
      this.setupComplete = true;
      this.web3LoadedObserver.complete();
      return new Promise((resolve, reject)=>{
        resolve(true);
      });
    })
    .catch(e => {
      console.log("ERR",e);
    });
  }

  //Helper promise. Can't figure out why sometimes values are not refreshed when calling after a transaction, even though it was actually processed.
  delay(t:number) {
     return new Promise(function(resolve) {
         setTimeout(resolve, t)
     });
  }

  getChosenNumber(){
    this.raffleInstance.getChosenNumber({
      from: this.account
    })
    .then(value =>{
      console.log(value);
    })
    .catch(e => {
      console.log(e);
    });
  }

}
