import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountReactivationComponent } from './pages/account-reactivation/account-reactivation.component';


const routes: Routes = [
  {
    path: 'home',
    component: AccountReactivationComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
