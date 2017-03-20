import { Component, Input } from '@angular/core';

import { Mode } from 'app/mode.model'
import { InputService } from 'app/input.service'

@Component({
  selector: 'app-inputs-panel',
  template: `
    <template ngFor let-mode [ngForOf]="getModes()">
      <h1>{{ getModeName(mode) }} Mode</h1>
      <div class="inputsTable">
        <div class="inputsTableRow"
            *ngFor="let keyMapping of input.keyMaps.get(mode)">
          <div class="inputsTableCell keyMapping"
              [ngClass]="{'selectedMode': mode == activeMode}">
            {{ keyMapping.command.toString() }}
          </div>
          <div class="inputsTableCell">{{ keyMapping.name }}</div>
        </div>
      </div>
    </template>
  `,
  styles: [`
    :host {
      box-shadow: 0px 0px 3px 3px rgba(0,0,0,.2);
      position: relative;
      padding: 0.8em;
      z-index: 1;
    }

    h1 {
      font-size: 1.25em;
    }

    .selectedMode {
      color: green;
    }

    .inputsTable {
      display: table;
    }

    .inputsTableRow {
      display: table-row;
    }

    .inputsTableCell {
      display: table-cell;
      width: auto;
      padding-right: 0.5em;
    }

    .keyMapping {
      font-weight: bold;
      text-align: right;
    }
  `]
})
export class InputsPanelComponent {
  @Input() activeMode: Mode
  constructor(private input: InputService) {
  }

  getModes() {
    return [Mode.command, Mode.edit]
  }

  // Gets capitalized mode name from Mode enum value.
  getModeName(mode: Mode) {
    let name = Mode[mode]
    return name[0].toUpperCase() + name.slice(1)
  }
}
