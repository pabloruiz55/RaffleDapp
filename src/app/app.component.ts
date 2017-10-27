import { Component} from '@angular/core';
import {RaffleService} from './services/raffle.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  constructor() {

  }

  /*@HostListener('window:load')
  windowLoaded() {
    this.checkAndInstantiateWeb3();
    this.onReady();
  }*/

  /*setupEventListeners(){
    var randomNumbers = this.raffleInstance.newRandomNumber_uint({fromBlock: "latest"});
    randomNumbers.watch(function(error, result) {
      // This will catch all Transfer events, regardless of how they originated.
      if (error == null) {
        console.log(result.args);
      }
    });
  }*/


}
