import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';
import { Routes, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
//import { AccountReactivationComponent } from './account-reactivation.component';
import {MatSelectModule} from '@angular/material/select';

const routes: Routes = [
  {
    path: '',
    //component: AccountReactivationComponent,
  },
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MaterialModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  exports: [],
 // declarations: [AccountReactivationComponent],
  providers: [],
})
export class AccountReactivationModule {}
