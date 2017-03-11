import { Component, Input, OnChanges, Output, EventEmitter, SimpleChanges
         } from '@angular/core';

import { Argument } from 'app/services/flow'

@Component({
  selector: 'app-argument',
  template: `
    <md-card
      class="argument"
      [ngClass]="{'argument-selected':  selected, 'argument-editing': editing}">
      <template [ngIf]="!editing">
        {{ argument.contents }}
      </template>
      <input #input
        class="argument-input"
        *ngIf="editing"
        [focus]="focusInput"
        [value]="editorText"
        (keypress)="editText.emit($event.target.value)" />
    </md-card>
  `,

  styles: [`
    :host {
      box-sizing: border-box;
    }
    .argument {
      width: 12em;
      padding: 0.5em;
      font-size: small;
    }

    .argument-selected {
      border: solid 0.2em;
      border-color: lightblue;
    }

    .argument-editing {
      background-color: lightgreen;
    }

    .argument-input {
      width: 100%;
      border: none;
      background: transparent;
      outline-width: 0;
      font-family: Roboto,"Helvetica Neue",sans-serif;
      font-size: small;
      padding: 0;
    }
  `],
})
export class ArgumentComponent implements OnChanges {
  // Workaround for https://github.com/angular/angular-cli/issues/2034
  @Input() argument = <Argument>null
  @Input() selected: boolean
  @Input() editing: boolean
  @Input() editorText: string
  @Output() editText = new EventEmitter()
  
  inputText: string

  private focusInput

  ngOnChanges(changes: SimpleChanges) {
    for (let change in changes) {
      if (change == "editing") {
        // Set this.focusInput = true to trigger a focus event, then unset.
        this.focusInput = true
        setTimeout(() => this.focusInput = false)
      }
    }
  }
}
