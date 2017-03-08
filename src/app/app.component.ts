import { Component } from '@angular/core';

import * as flow from 'app/models/flow'

@Component({
  selector: 'app-root',
  template: `
    <flow [flow]="flow"></flow>
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
    this.flow.cursor = { contents: "Contentytents" }
  }
}
