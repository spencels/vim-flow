import { Component, ElementRef, ViewChild } from '@angular/core'

import { FileService } from 'app/file.service'

@Component({
  selector: 'app-toolbar',
  template: `
    <header id="toolbar">
      <div id="leftButtons">
        <button md-raised-button class="toolbarButton" (click)="newFlow()">
          New
        </button>
        <button md-raised-button class="toolbarButton" (click)="load()">
          Open
        </button>
        <button md-raised-button class="toolbarButton" (click)="save()">
          Save
        </button>
      </div>
      <div id="title">
        <span [ngClass]="{'newFlow': !fileService.flowName}">
          {{ fileService.flowName || "New Flow" }}
        </span>
      </div>
    </header>
  `,

  styles: [`
    #toolbar {
      height: 2em;
      background-color: red;
      color: white;
      
      position: relative;
      width: 100%;
      overflow: hidden;
      box-shadow: 3px 3px 3px; #888888;
      z-index: 20;
    }

    #title {
      font-family: arial;
      font-size: 1.2em;

      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      position: absolute;
    }

    .toolbarButton {
      width: 3.5em;

      display: flex;
      align-items: center;
      float: left;
      position: relative;
      margin: 0 0.5em;

      z-index: 1;
    }

    #leftButtons {
      height: 100%;
      float: left;
      position: relative;

      left: 1em;
    }

    .fileInput {
      display: none;
    }

    .newFlow {
      font-style: italic;
    }
  `]
})
export class ToolbarComponent {
  constructor(private fileService: FileService) {}

  newFlow() {
    if (window.confirm('Delete contents and create new flow?')) {
      this.fileService.newFlow()
    }
  }

  load() {
    let input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.style.display = 'none'

    input.onchange = (event) => {
      try {
        this.fileService.load(input.files[0])
      } catch (e) {
        alert('Invalid file.')
      }
    }

    document.body.appendChild(input)
    try {
      input.click()
    } finally {
      document.body.removeChild(input)
    }

  }

  save() {
    this.fileService.save()
  }
}