import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AppConfigService } from './core/services/appconfig.service';
import { HttpClientModule } from '@angular/common/http';
// import { StanButtonModule } from 'ngx-shared-components';
import { InterswitchUtilityService } from './shared/utils';
import { InterswitchService } from './core/services/interswitch.service';
import { MatIconModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material';
import { BotDetectCaptchaModule } from 'angular-captcha';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { DatePipe } from '@angular/common';
import { AccountReactivationService } from './core/services/acct-reactivation.service';
import { UtilityService } from './core/services/utils.service';
import { AccountReactivationComponent } from './pages/account-reactivation/account-reactivation.component';

@NgModule({
  declarations: [
    AppComponent,
    AccountReactivationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatIconModule,
    MatCheckboxModule,
    HttpClientModule,
    BotDetectCaptchaModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    // StanButtonModule
  ],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }, DatePipe,AppConfigService, InterswitchUtilityService, InterswitchService,
    AccountReactivationService, UtilityService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
