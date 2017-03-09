import { Component, Input } from '@angular/core';

import { Argument } from 'app/models/flow'

@Component({
  selector: 'app-argument',
  template: `
    <md-card class="argument" [ngClass]="{'argument-selected':  selected}">
      {{ argument.contents }}
    </md-card>
  `,

  styles: [`
    .argument {
    }

    .argument-selected {
      border: solid 0.5em;
      border-color: red;
    }
  `]
})
export class ArgumentComponent {
  @Input() argument: Argument;
  @Input() selected: boolean;
}
