import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StatFormComponent } from './stat-form/stat-form.component';
import { FormsModule } from '@angular/forms';
import { SignedNumberPipe } from './monsterClass';
import { InsertDCPipe } from './insert-dc.pipe';

@NgModule({
  declarations: [
    AppComponent,
    StatFormComponent,
    SignedNumberPipe,
    InsertDCPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    SignedNumberPipe
  ]
})
export class AppModule { }
