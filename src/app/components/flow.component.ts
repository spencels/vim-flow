import { Component, Input, Output, EventEmitter } from '@angular/core'

import { Flow, Argument } from 'app/models/flow'

@Component({
  selector: 'app-flow',
  template: `
    <div class="flow-container">
      <div class="argumentGroup"
           *ngFor="let argumentGroup of flow.argumentGroups">
        <div class="speech" *ngFor="let speech of argumentGroup">
          <app-argument
            *ngFor="let argument of speech"
            [argument]="argument"
            [selected]="isArgumentSelected(argument)"
            (click)="selectArgument.emit(argument)">
          </app-argument>
        </div>
      </div>
    </div>
  `,

  styles: [`
    * {
      box-sizing: border-box;
    }

    .flow-container {
      display: table;
    }

    .argumentGroup {
      display: table-row;
      border-bottom: 0.25em solid #000;
    }

    .speech {
      display: table-cell;
      margin: 1em;
    }

  `]
})
export class FlowComponent {
  @Input() flow: Flow;
  @Output() selectArgument = new EventEmitter();

  isArgumentSelected(argument: Argument) {
    return Object.is(this.flow.cursor, argument);
  }
}