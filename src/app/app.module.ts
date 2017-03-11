import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material'

import { AppComponent } from 'app/app.component';
import { FlowComponent } from 'app/components/flow.component';
import { ArgumentComponent } from 'app/components/argument.component'
import { FocusDirective } from 'app/directives/focus'

import { FlowService } from 'app/services/flow'
import { EditService } from 'app/services/edit'

@NgModule({
  declarations: [
    AppComponent,
    FlowComponent,
    ArgumentComponent,
    FocusDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule
  ],
  providers: [FlowService, EditService],
  bootstrap: [AppComponent]
})
export class AppModule { }
