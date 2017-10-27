import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RafflesComponent } from './components/raffles/raffles.component';
import { RaffleDetailComponent } from './components/raffle-detail/raffle-detail.component';
import {APP_ROUTING} from './app.routes';

import {RaffleService} from './services/raffle.service';

@NgModule({
  declarations: [
    AppComponent,
    RafflesComponent,
    RaffleDetailComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTING
  ],
  providers: [RaffleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
