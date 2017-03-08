import { Component, Input } from '@angular/core';

import { Argument } from 'app/models/flow'

@Component({
  selector: 'app-argument',
  template: `
    <div class="card-wrapper" [ngClass]="{'argument-selected':  selected}">
      <md-card class="argumentClass">
        {{ argument.contents }}
      </md-card>
    </div>
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
