import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material'

import { AppComponent } from 'app/app.component';
import { FlowComponent } from 'app/flow.component';
import { ArgumentComponent } from 'app/argument.component'
import { InputsPanelComponent } from 'app/inputsPanel.component'
import { ToolbarComponent } from 'app/toolbar.component'

import { FocusDirective } from 'app/focus.directive'

import { FlowService } from 'app/flow.service'
import { EditService } from 'app/edit.service'
import { InputService } from 'app/input.service';
import { FileService } from 'app/file.service'
import { DownloadService } from 'app/download.service'

@NgModule({
  declarations: [
    AppComponent,
    FlowComponent,
    ArgumentComponent,
    FocusDirective,
    InputsPanelComponent,
    ToolbarComponent
  ],

  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule
  ],

  providers: [
    FlowService,
    EditService,
    InputService,
    FileService,
    DownloadService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
