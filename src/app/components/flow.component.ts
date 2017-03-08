import { Component, Input, EventEmitter } from '@angular/core'

import { Flow } from 'app/models/flow'

@Component({
  selector: 'flow',
  template: `
    <div class="argumentGroup" *ngFor="let argumentGroups of flow.argumentGroups">
      <div class="speech" *ngFor="let speeches of argumentGroups">
        <md-card class="argument" *ngFor="let argument of speeches">
          {{ argument.contents }}
        </md-card>
      </div>
    </div>
  `,

  styles: [`
    * {
      box-sizing: border-box;
    }

    .argumentGroup {
      border: 2px solid;
      float: left;
      float: clear;
      width: 100%;
    }
    .speech {
      position: relative;
      display: inline-block;
      float: left;
    }
    .argument {
      float: left;
      clear: left;
    }
  `]
})
export class FlowComponent {
  @Input() flow: Flow;
}