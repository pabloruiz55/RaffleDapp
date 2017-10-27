import { Component, OnInit, NgZone } from '@angular/core';
import {RaffleService} from '../../services/raffle.service';
import {RouterLink,Route,ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-raffle-detail',
  templateUrl: './raffle-detail.component.html',
  styleUrls: ['./raffle-detail.component.css']
})
export class RaffleDetailComponent implements OnInit {

  raffleAddress:string;
  loadedRaffleData = false;
  raffleParticipants:any[] = [];
  raffleWinner:string;
  minParticipants:number;
  maxParticipants:number;
  joinedParticipants:number;
  organizer:number;
  raffleFinished:boolean = false;

  constructor(private _rs: RaffleService,private route: ActivatedRoute,private _ngZone:NgZone) {

  }

  ngOnInit() {
    if(this._rs.setupComplete){
      this.initialize();
    }else{
      let subscription = this._rs.web3LoadedEvent.subscribe(
            value => {},
            error => {},
            () => {
              this.initialize();
            }
        );
    }

  }

  initialize(){
    console.log("QWQWQWQWQWQW");
    this.route.params.subscribe(params => {
      this.raffleAddress = params['id'];
      console.log("ADDERERER",this.raffleAddress);
      this._rs.getRaffleInstanceAt(this.raffleAddress)
      .then(value=>{
        this._ngZone.run(() =>{
        this.loadedRaffleData = value;
        this.getParticipants();
        this.getWinnerAddress();
        this.getRaffleStaticData();
        })
      })
    });
  }

  generateRandomNum(){
    if(!this.loadedRaffleData) return;
    if(this.raffleFinished){
      alert("Sorry, the Raffle has already finished");
      return;
    }
    this._rs.raffleInstance.generateRandomNum({
      from: this._rs.account,
      gas:350000
    })
    .then(value =>{
      console.log(value);
      this.raffleFinished = true;
    })
    .catch(e => {
      console.log(e);
    });
  }

  getChosenNumber(){
    if(!this.loadedRaffleData) return;
    this._rs.raffleInstance.getChosenNumber({
      from: this._rs.account
    })
    .then(value =>{
      console.log(value);
    })
    .catch(e => {
      console.log(e);
    });
  }

  getRaffleStaticData(){
    if(!this.loadedRaffleData) return;
    this._rs.raffleInstance.getRaffleStaticData({
      from: this._rs.account
    })
    .then(value =>{
      console.log(value);
      this.minParticipants = value[0];
      this.maxParticipants = value[1];
      this.joinedParticipants = value[2];
      this.raffleFinished = value[3];
      this.organizer = value[4];
    })
    .catch(e => {
      console.log(e);
    });
  }

  getMaxParticipants(){
    if(!this.loadedRaffleData) return;
    this._rs.raffleInstance.getMaxParticipants({
      from: this._rs.account
    })
    .then(value =>{
      console.log(value);
      this.maxParticipants = value;
    })
    .catch(e => {
      console.log(e);
    });
  }

  getParticipants(){
    this.raffleParticipants = [];
    this._rs.raffleInstance.getParticipants({
      from: this._rs.account
    })
    .then(value =>{
      console.log(value);
      this.raffleParticipants = value;
    })
    .catch(e => {
      console.log(e);
    });
  }

  getWinnerAddress(){
    this._rs.raffleInstance.getWinnerAddress({
      from: this._rs.account
    })
    .then(value =>{
      console.log(value);
      this.raffleWinner = value;
    })
    .catch(e => {
      console.log(e);
    });
  }

  joinRaffle(){
    if(!this.loadedRaffleData) return;
    if(this.raffleFinished){
      alert("Sorry, the Raffle has already finished");
      return;
    }
    this._rs.raffleFactoryInstance.joinRaffle(this._rs.raffleInstance.address,{
      from: this._rs.account
    })
    .then(value =>{
      console.log(value);
      return this._rs.delay(3000);

    })
    .then(v =>{
      this.getParticipants();
    })
    .catch(e => {
      console.log(e);
    });
  }

}
