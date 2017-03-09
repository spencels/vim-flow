import { Component, OnInit, HostListener } from '@angular/core';

import * as flow from 'app/models/flow'

@Component({
  selector: 'app-root',
  template: `
    <app-flow 
      [flow]="flow"
      (selectArgument)="selectArgument($event)"
      (window:keypress)="keyPress($event)">
    </app-flow>
  `,
})
export class AppComponent extends OnInit {
  title = 'app works!';
  flow = new flow.Flow();

  ngOnInit() {
    this.flow.argumentGroups = [
      [
        [
          { contents: "Arg1" },
          { contents: "Arg2" }
        ],
        [
          { contents: "Arg1Speech2"}
        ]
      ],
      [
        [
          { contents: "Arg1" },
          { contents: "Arg2" }
        ]
      ]
    ]
  }

  // Selects argument by reference.
  selectArgument(argument: flow.Argument) {
    this.flow.selectArgument(argument);
  }

  // @HostListener('keydown', ['$event'])
  keyPress(event: KeyboardEvent) {
    switch (event.key) {
      case 'j':
        this.flow.selectDown();
        break
      case 'k':
        this.flow.selectUp();
        break
      case 'l':
        this.flow.selectRight()
        break
      case 'h':
        this.flow.selectLeft()
        break
      default:
        break
    }
  }
}
