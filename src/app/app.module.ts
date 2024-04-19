import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { AddEditComponent } from './bookings/add-edit/add-edit.component';
import { ViewComponent } from './bookings/view/view.component';
import { NgZorroAntdModule } from './ng-zorro-antd.module';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    AddEditComponent,
    ViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
})
export class AppModule {}
