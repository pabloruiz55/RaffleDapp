import { Component, OnInit,NgZone, ChangeDetectorRef } from '@angular/core';
import {RaffleService} from '../../services/raffle.service';

@Component({
  selector: 'app-raffles',
  templateUrl: './raffles.component.html',
  styleUrls: ['./raffles.component.css']
})
export class RafflesComponent implements OnInit {

  userRaffles:any[] =[];
  rafflesJoinedByUser:any[] =[];

  constructor(private _rs: RaffleService, private _ngZone:NgZone) { }

  ngOnInit() {
    if(this._rs.setupComplete){
      //this.getRafflesFromEventLogs();
      this.getRafflesCreatedByUser();
      this.getRafflesJoinedByUser();
    }else{
      let subscription = this._rs.web3LoadedEvent.subscribe(
            value => {},
            error => {},
            () => {
              //this.getRafflesFromEventLogs();
              this.getRafflesCreatedByUser();
              this.getRafflesJoinedByUser();
            }
        );
    }

  }

  getRafflesFromEventLogs(){
    var randomNumbers = this._rs.raffleFactoryInstance.RaffleCreated({raffleOrganizer:this._rs.account},{fromBlock: 0, toBlock: 'latest'});
    randomNumbers.get((error, result)=> {
      // This will catch all Transfer events, regardless of how they originated.
      this._ngZone.run(() =>{
        if (error == null) {
          console.log("r?",result);
          this.userRaffles = [];
          for (var i = 0; i < result.length; i++) {
            var log = result[i];
            let raffle = {
              raffleAddress: log.args.raffleAddress,
              raffleOrganizer: log.args.raffleOrganizer
            }
            this.userRaffles.push(raffle);
            console.log("Raffle Address: ",log.args.raffleAddress, "Organizer: ",log.args.raffleOrganizer);
          }
      //this._changeDetRef.detectChanges();
        }
      })
    });
  }

  startRaffle(min:number, max:number){
    this._rs.raffleFactoryInstance.startRaffle(min,max,{
      from: this._rs.account,
      gas: 3000000
    })
    .then(result =>{
      this._ngZone.run(() =>{
        console.log(result);
        for (var i = 0; i < result.logs.length; i++) {
          var log = result.logs[i];

          if (log.event == "RaffleCreated") {
            console.log("UUUUU",log.args.raffleAddress);
            return this._rs.delay(1500);
            //Router navigate to ruffle details.
            //break;
          }
        }
      });
    })
    .then(r=>{
      this.getRafflesCreatedByUser();
    })
    .catch(e => {
      console.log(e);
    });
  }

  getRafflesCreatedByUser(){
    this._rs.raffleFactoryInstance.getUserRaffles({
      from: this._rs.account
    })
    .then(value =>{
      this._ngZone.run(() =>{
        console.log("RESER",value);
        this.userRaffles = [];
        for (let r of value){
          this.getRaffleData(r)
          .then(res=>{
            this.userRaffles.push(res);
          })
        }
      });
    })
    .catch(e => {
      console.log("W?", e);
    });
  }

  getRafflesJoinedByUser(){
    this._rs.raffleFactoryInstance.getRafflesJoinedByUser({
      from: this._rs.account
    })
    .then(value =>{
      this._ngZone.run(() =>{
        this.rafflesJoinedByUser = [];
        for (let r of value){
          this.getRaffleData(r)
          .then(res=>{
            this.rafflesJoinedByUser.push(res);
          })
        }
      });
    })
    .catch(e => {
      console.log("W?", e);
    });
  }

  getRaffleData(raffleAddress:string): Promise<any>{
    return this._rs.raffleFactoryInstance.getRaffleData(raffleAddress,{
      from: this._rs.account
    })
    .then(value =>{
      console.log("User raffles Obj");
      return value;
    })
    .catch(e => {
      console.log("W?", e);
    });
  }

  /*getRafflesCreated(){
    this._rs.raffleFactoryInstance.getRafflesCreated({
      from: this._rs.account
    })
    .then(value =>{
      console.log("List");
      console.log(value);
    })
    .catch(e => {
      console.log("W?", e);
    });
  }*/

}
