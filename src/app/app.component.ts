import { Component } from '@angular/core';

import * as flow from 'app/models/flow'

@Component({
  selector: 'app-root',
  template: `
    <app-flow [flow]="flow"></app-flow>
  `,
})
export class AppComponent {
  title = 'app works!';
  flow = new flow.Flow();

  constructor() {
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
    this.flow.cursor = this.flow.argumentGroups[0][0][0];
  }
}
