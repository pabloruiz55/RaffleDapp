import { RouterModule, Routes } from '@angular/router';
import {RafflesComponent} from './components/raffles/raffles.component';
import {RaffleDetailComponent} from './components/raffle-detail/raffle-detail.component';

const APP_ROUTES: Routes = [
  { path: '', component: RafflesComponent },
  { path: ':id', component: RaffleDetailComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES,{useHash:true});
