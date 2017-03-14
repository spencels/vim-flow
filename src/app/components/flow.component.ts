import { Component, Input, Output, EventEmitter } from '@angular/core'

import { FlowService } from 'app/services/flow'
import { Argument } from 'app/models/flow'
import { EditService } from 'app/services/edit'

@Component({
  selector: 'app-flow',
  template: `
    <div class="flow-container">
      <div class="argumentGroup"
           *ngFor="let argumentGroup of flow.argumentGroups;
                   let iArgumentGroup = index">
        <div class="speech"
             (click)="selectSpeech.emit([iArgumentGroup, iSpeech])"
             *ngFor="let iSpeech of getSpeechesRange()">
          <div class="empty-selected"
               *ngIf="isEmptySelection(iArgumentGroup, iSpeech)">
          </div>
          <template [ngIf]="iSpeech < argumentGroup.length">
            <app-argument
                *ngFor="let argument of argumentGroup[iSpeech];
                        let iArgument = index"
                [argument]="argument"
                [selected]="isArgumentSelected(argument)"
                [editing]="isEditing(iArgumentGroup, iSpeech, iArgument)"
                [editorText]="editModel.text"
                (editText)="editText.emit($event)"
                (click)="selectArgumentInternal($event, argument)">
            </app-argument>
          </template>
        </div>
      </div>
    </div>
  `,

  styles: [`
    :host {
      box-sizing: border-box;
    }

    .flow-container {
      display: table;
      background-color: white;
    }

    .argumentGroup {
      display: table-row;
    }

    .speech {
      display: table-cell;
      margin: 1em;
      padding: 0.7em;
      border-bottom: 0.20em solid gray;
      border-left: 0.1em dotted;
      border-right: 0.1em dotted;
      min-width: 6em
    }

    .empty-selected {
      height: 1em;
      width: 9em;
      background-color: lightblue;
    }
  `]
})
export class FlowComponent {
  @Input() flow: FlowService
  @Input() editModel: EditService
  @Output() selectArgument = new EventEmitter()
  @Output() selectSpeech = new EventEmitter()
  @Output() editText = new EventEmitter()

  private selectArgumentInternal(event: MouseEvent, argument: Argument) {
    event.stopPropagation()
    this.selectArgument.emit(argument)
  }

  // Returns array of increasing integers ([0, 1, ...]) whose length is equal to
  // flow.speechesCount.
  getSpeechesRange() {
    return Array(this.flow.speechesCount + 1).fill(null).map((x, i) => i)
  }

  isArgumentSelected(argument: Argument) {
    return Object.is(this.flow.selectedArgument, argument);
  }

  // True if empty speech is selected.
  isEmptySelection(iArgumentGroup: number, iSpeech: number) {
    return this.flow.selectedArgument == null
      && this.flow.cursor.iArgumentGroup == iArgumentGroup
      && this.flow.cursor.iSpeech == iSpeech
  }

  isEditing(iArgumentGroup, iSpeech, iArgument) {
    return this.editModel.isEditing(iArgumentGroup, iSpeech, iArgument)
  }
}